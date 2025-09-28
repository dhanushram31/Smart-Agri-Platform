import React, { useState } from 'react';
import { Download, FileText, Loader, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportExport = ({ schemesData, gdpData, yieldData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const generatePDFReport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Agriculture Scheme Portal Report', 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${currentDate}`, 20, 40);
      
      let yPosition = 60;

      // Government Schemes Section
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Government Schemes Summary', 20, yPosition);
      yPosition += 15;

      if (schemesData && schemesData.length > 0) {
        const schemeTableData = schemesData.map(scheme => [
          scheme.name,
          scheme.shortDescription.substring(0, 50) + '...',
          scheme.subsidyType || 'N/A',
          scheme.eligibility.substring(0, 40) + '...'
        ]);

        doc.autoTable({
          head: [['Scheme Name', 'Description', 'Type', 'Eligibility']],
          body: schemeTableData,
          startY: yPosition,
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
            2: { cellWidth: 30 },
            3: { cellWidth: 50 }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 20;
      }

      // Agriculture GDP Section
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Agriculture GDP Analysis', 20, yPosition);
      yPosition += 15;

      if (gdpData && gdpData.length > 0) {
        const gdpTableData = gdpData.map(data => [
          data.year.toString(),
          `₹${data.gdp} Trillion`,
          `${data.growth > 0 ? '+' : ''}${data.growth}%`
        ]);

        doc.autoTable({
          head: [['Year', 'GDP', 'Growth %']],
          body: gdpTableData,
          startY: yPosition,
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 30 }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 20;

        // GDP Summary
        const avgGrowth = (gdpData.reduce((sum, data) => sum + data.growth, 0) / gdpData.length).toFixed(1);
        const maxGDP = Math.max(...gdpData.map(data => data.gdp));
        const currentYear = new Date().getFullYear();
        const currentYearData = gdpData.find(data => data.year === currentYear);

        doc.setFontSize(12);
        doc.text(`Average Growth Rate: ${avgGrowth}%`, 20, yPosition);
        doc.text(`Highest GDP: ₹${maxGDP} Trillion`, 20, yPosition + 10);
        if (currentYearData) {
          doc.text(`Current Year (${currentYear}) GDP: ₹${currentYearData.gdp} Trillion`, 20, yPosition + 20);
        }
        yPosition += 35;
      }

      // Yield Report Section
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Crop Yield Report', 20, yPosition);
      yPosition += 15;

      if (yieldData && yieldData.length > 0) {
        const yieldTableData = yieldData.map(crop => [
          crop.crop,
          `${crop.yield} ${crop.unit}`,
          `${crop.lastYearYield} ${crop.unit}`,
          `${crop.growth > 0 ? '+' : ''}${crop.growth}%`
        ]);

        doc.autoTable({
          head: [['Crop', 'Current Yield', 'Last Year Yield', 'Growth %']],
          body: yieldTableData,
          startY: yPosition,
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 45 },
            2: { cellWidth: 45 },
            3: { cellWidth: 30 }
          }
        });

        yPosition = doc.lastAutoTable.finalY + 20;

        // Yield Summary
        const avgYieldGrowth = (yieldData.reduce((sum, crop) => sum + crop.growth, 0) / yieldData.length).toFixed(1);
        const positiveGrowthCrops = yieldData.filter(crop => crop.growth > 0).length;
        const bestPerformer = yieldData.find(crop => crop.growth === Math.max(...yieldData.map(c => c.growth)));

        doc.setFontSize(12);
        doc.text(`Average Yield Growth: ${avgYieldGrowth}%`, 20, yPosition);
        doc.text(`Crops with Positive Growth: ${positiveGrowthCrops}/${yieldData.length}`, 20, yPosition + 10);
        if (bestPerformer) {
          doc.text(`Best Performing Crop: ${bestPerformer.crop} (+${bestPerformer.growth}%)`, 20, yPosition + 20);
        }
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Agriculture Scheme Portal - Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save(`Agriculture_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <FileText className="mr-2 h-6 w-6 text-blue-600" />
            Export Report
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Download comprehensive agriculture data report as PDF
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Report Includes:
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            Government schemes summary with benefits and eligibility
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Agriculture GDP trends and growth analysis
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            Crop yield performance and comparison data
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
            Statistical summaries and key insights
          </li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={generatePDFReport}
          disabled={isExporting}
          className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${
            isExporting
              ? 'bg-gray-400 cursor-not-allowed'
              : exportSuccess
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          } text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
        >
          {isExporting ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Generating Report...
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Report Downloaded!
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </>
          )}
        </button>
      </div>

      {/* Data Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            Schemes
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {schemesData?.length || 0}
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            GDP Data Points
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {gdpData?.length || 0}
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
          <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
            Crop Reports
          </h4>
          <p className="text-2xl font-bold text-purple-600">
            {yieldData?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;