import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './FinancialTracker.css';

const FinancialTracker = ({ farmId, farmName, farmLocation }) => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'seeds',
    date: new Date().toISOString().split('T')[0]
  });
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    // Load transactions from localStorage specific to this farm
    const savedTransactions = localStorage.getItem(`transactions_${farmId}`);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, [farmId]);

  useEffect(() => {
    // Save transactions to localStorage whenever transactions change
    localStorage.setItem(`transactions_${farmId}`, JSON.stringify(transactions));
  }, [transactions, farmId]);

  const addTransaction = () => {
    if (newTransaction.description.trim() && newTransaction.amount) {
      const transaction = {
        id: Date.now(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        createdAt: new Date().toISOString()
      };
      setTransactions([...transactions, transaction]);
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: 'seeds',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      if (dateRange !== 'all') {
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const calculateTotals = () => {
    const filteredTransactions = getFilteredTransactions();
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses
    };
  };

  const getCategoryBreakdown = () => {
    const filteredTransactions = getFilteredTransactions();
    const breakdown = {};
    
    filteredTransactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { income: 0, expense: 0 };
      }
      breakdown[t.category][t.type] += t.amount;
    });
    
    return breakdown;
  };

  const generatePDF = async () => {
    const element = document.getElementById('financial-report');
    if (!element) return;

    // Create a temporary container for PDF content
    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2e7d32; margin-bottom: 10px;">Financial Report</h1>
          <h2 style="color: #666; margin-bottom: 5px;">${farmName || 'Farm'}</h2>
          <p style="color: #888; margin: 0;">${farmLocation || 'Location not specified'}</p>
          <p style="color: #888; margin: 5px 0;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">Financial Summary</h3>
          <div style="display: flex; justify-content: space-between; margin: 15px 0;">
            <div style="text-align: center; flex: 1;">
              <h4 style="color: #4caf50; margin: 5px 0;">Total Income</h4>
              <p style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 0;">₹${calculateTotals().totalIncome.toFixed(2)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <h4 style="color: #f44336; margin: 5px 0;">Total Expenses</h4>
              <p style="font-size: 24px; font-weight: bold; color: #d32f2f; margin: 0;">₹${calculateTotals().totalExpenses.toFixed(2)}</p>
            </div>
            <div style="text-align: center; flex: 1;">
              <h4 style="color: #2196f3; margin: 5px 0;">Net Profit</h4>
              <p style="font-size: 24px; font-weight: bold; color: ${calculateTotals().netProfit >= 0 ? '#2e7d32' : '#d32f2f'}; margin: 0;">₹${calculateTotals().netProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">Category Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Category</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Income</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Expenses</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Net</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(getCategoryBreakdown()).map(([category, amounts]) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; text-transform: capitalize;">${category}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: #4caf50;">₹${amounts.income.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: #f44336;">₹${amounts.expense.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: ${(amounts.income - amounts.expense) >= 0 ? '#4caf50' : '#f44336'};">₹${(amounts.income - amounts.expense).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div>
          <h3 style="color: #2e7d32; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">Recent Transactions</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Date</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Category</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Type</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${getFilteredTransactions().slice(0, 20).map(transaction => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;">${new Date(transaction.date).toLocaleDateString()}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${transaction.description}</td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-transform: capitalize;">${transaction.category}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">
                    <span style="padding: 2px 6px; border-radius: 4px; font-size: 12px; color: white; background-color: ${transaction.type === 'income' ? '#4caf50' : '#f44336'};">
                      ${transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: ${transaction.type === 'income' ? '#4caf50' : '#f44336'};">₹${transaction.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add to body temporarily for rendering
    document.body.appendChild(pdfContent);
    
    try {
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`financial-report-${farmName?.replace(/\s+/g, '-') || 'farm'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Remove temporary element
      document.body.removeChild(pdfContent);
    }
  };

  const { totalIncome, totalExpenses, netProfit } = calculateTotals();

  const getCategoryIcon = (category) => {
    const icons = {
      seeds: '🌱',
      fertilizer: '🧪',
      equipment: '🚜',
      labor: '👷',
      irrigation: '💧',
      harvest: '🌾',
      marketing: '📊',
      maintenance: '🔧',
      fuel: '⛽',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="financial-tracker-container">
      <div className="tracker-header">
        <h3>Financial Tracker</h3>
        <button onClick={generatePDF} className="pdf-export-btn">
          📄 Export PDF Report
        </button>
      </div>

      <div id="financial-report" className="financial-summary">
        <div className="summary-cards">
          <div className="summary-card income">
            <h4>Total Income</h4>
            <p className="amount">₹{totalIncome.toFixed(2)}</p>
            <div className="icon">💵</div>
          </div>
          <div className="summary-card expense">
            <h4>Total Expenses</h4>
            <p className="amount">₹{totalExpenses.toFixed(2)}</p>
            <div className="icon">💸</div>
          </div>
          <div className={`summary-card profit ${netProfit < 0 ? 'negative' : ''}`}>
            <h4>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</h4>
            <p className="amount">₹{Math.abs(netProfit).toFixed(2)}</p>
            <div className="icon">{netProfit >= 0 ? '📈' : '📉'}</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Transaction Type</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Time Period</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="filter-select">
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="add-transaction-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              placeholder="Enter description..."
              className="transaction-input"
            />
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              placeholder="0.00"
              className="transaction-input"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              className="transaction-select"
            >
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              className="transaction-select"
            >
              <option value="seeds">🌱 Seeds</option>
              <option value="fertilizer">🧪 Fertilizer</option>
              <option value="equipment">🚜 Equipment</option>
              <option value="labor">👷 Labor</option>
              <option value="irrigation">💧 Irrigation</option>
              <option value="harvest">🌾 Harvest Sale</option>
              <option value="marketing">📊 Marketing</option>
              <option value="maintenance">🔧 Maintenance</option>
              <option value="fuel">⛽ Fuel</option>
              <option value="other">📝 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              className="transaction-input"
            />
          </div>
        </div>
        <button onClick={addTransaction} className="add-btn">
          ➕ Add Transaction
        </button>
      </div>

      <div className="transactions-container">
        <div className="transactions-header">
          <h4>📋 Recent Transactions</h4>
          <span className="transaction-count">{getFilteredTransactions().length} transaction{getFilteredTransactions().length !== 1 ? 's' : ''}</span>
        </div>
        {getFilteredTransactions().length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <p>No transactions found</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Add your first transaction to start tracking!</p>
          </div>
        ) : (
          <div className="transactions-list">
            {getFilteredTransactions().map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className={`transaction-icon ${transaction.type}`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-title">{transaction.description}</div>
                  <div className="transaction-meta">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-date">📅 {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  className="delete-btn"
                  title="Delete transaction"
                  aria-label="Delete transaction"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="category-breakdown">
        <h4>📊 Category Breakdown</h4>
        <div className="category-grid">
          {Object.entries(getCategoryBreakdown()).map(([category, amounts]) => (
            <div key={category} className="category-card">
              <div className="category-name">
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <div className="category-amounts">
                <div className="category-row">
                  <label>Income:</label>
                  <span className="value income">₹{amounts.income.toFixed(2)}</span>
                </div>
                <div className="category-row">
                  <label>Expense:</label>
                  <span className="value expense">₹{amounts.expense.toFixed(2)}</span>
                </div>
                <div className="category-row">
                  <label>Net:</label>
                  <span className="value net">₹{(amounts.income - amounts.expense).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialTracker;
