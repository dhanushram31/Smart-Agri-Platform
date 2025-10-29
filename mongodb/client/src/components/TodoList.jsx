import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = ({ farmId }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');

  useEffect(() => {
    // Load todos from localStorage specific to this farm
    const savedTodos = localStorage.getItem(`todos_${farmId}`);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, [farmId]);

  useEffect(() => {
    // Save todos to localStorage whenever todos change
    localStorage.setItem(`todos_${farmId}`, JSON.stringify(todos));
  }, [todos, farmId]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority,
        category,
        createdAt: new Date().toISOString(),
        dueDate: null
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateDueDate = (id, dueDate) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#90a4ae';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'planting': return '🌱';
      case 'irrigation': return '💧';
      case 'harvesting': return '🌾';
      case 'maintenance': return '🔧';
      case 'planning': return '📋';
      case 'general': return '🌿'; // Changed to green leaf
      default: return '🌿'; // Changed to green leaf as default
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h3>📋 Farm ToDo List</h3>
        <div className="todo-stats">
          <span className="completed-stats">
            {completedCount}/{totalCount} completed
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="todo-input-section">
        <div className="input-row">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="todo-input"
          />
          <button onClick={addTodo} className="add-todo-btn">
            Add
          </button>
        </div>
        
        <div className="todo-options">
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="general">General</option>
            <option value="planting">Planting</option>
            <option value="irrigation">Irrigation</option>
            <option value="harvesting">Harvesting</option>
            <option value="maintenance">Maintenance</option>
            <option value="planning">Planning</option>
          </select>
        </div>
      </div>

      <div className="todos-list">
        {todos.length === 0 ? (
          <div className="no-todos">
            <p>No tasks yet. Add your first farm task above! 🌱</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-content">
                <div className="todo-main">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="category-icon">{getCategoryIcon(todo.category)}</span>
                  <span className="todo-text">{todo.text}</span>
                </div>
                
                <div className="todo-meta">
                  <span 
                    className="priority-badge" 
                    style={{ backgroundColor: getPriorityColor(todo.priority) }}
                  >
                    {todo.priority}
                  </span>
                  <input
                    type="date"
                    value={todo.dueDate || ''}
                    onChange={(e) => updateDueDate(todo.id, e.target.value)}
                    className="due-date-input"
                    title="Set due date"
                  />
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
