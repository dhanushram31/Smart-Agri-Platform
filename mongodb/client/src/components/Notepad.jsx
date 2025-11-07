import React, { useState, useEffect } from 'react';
import './Notepad.css';

const Notepad = ({ farmId, farmName = 'Farm' }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    { value: 'general', label: 'General', icon: '📝', color: '#22c55e' },
    { value: 'planting', label: 'Planting', icon: '🌱', color: '#16a34a' },
    { value: 'harvest', label: 'Harvest', icon: '🌾', color: '#15803d' },
    { value: 'weather', label: 'Weather', icon: '🌤️', color: '#3b82f6' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#f59e0b' },
    { value: 'observations', label: 'Observations', icon: '👁️', color: '#8b5cf6' }
  ];

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`farm_notes_${farmId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [farmId]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (farmId) {
      localStorage.setItem(`farm_notes_${farmId}`, JSON.stringify(notes));
    }
  }, [notes, farmId]);

  const handleAddNote = () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const newNote = {
      id: Date.now(),
      title: currentNote.title.trim(),
      content: currentNote.content.trim(),
      category: currentNote.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote({ title: '', content: '', category: 'general' });
    setShowAddForm(false);
  };

  const handleEditNote = (note) => {
    setCurrentNote({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setIsEditing(true);
    setEditingId(note.id);
    setShowAddForm(true);
  };

  const handleUpdateNote = () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setNotes(prev => prev.map(note => 
      note.id === editingId
        ? {
            ...note,
            title: currentNote.title.trim(),
            content: currentNote.content.trim(),
            category: currentNote.category,
            updatedAt: new Date().toISOString()
          }
        : note
    ));
    
    resetForm();
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const resetForm = () => {
    setCurrentNote({ title: '', content: '', category: 'general' });
    setIsEditing(false);
    setEditingId(null);
    setShowAddForm(false);
  };

  const getCategoryInfo = (categoryValue) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notepad-container">
      <div className="notepad-header">
        <h3>Farm Notepad</h3>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        <button 
          className="new-note-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '➕ New Note'}
        </button>
      </div>

      {/* Add/Edit Note Form */}
      {showAddForm && (
        <div className="note-editor">
          <div className="editor-header">
            <h4>{isEditing ? 'Edit Note' : 'New Note'}</h4>
            <button onClick={resetForm} className="cancel-btn">
              ✕ Cancel
            </button>
          </div>
          <div className="editor-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter note title..."
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                className="note-input"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={currentNote.category}
                onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
                className="note-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                placeholder="Write your note here..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                className="note-textarea"
                rows="6"
              />
            </div>
            <button 
              onClick={isEditing ? handleUpdateNote : handleAddNote}
              className="save-note-btn"
            >
              {isEditing ? '💾 Update Note' : '✅ Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="category-pills">
        <button
          className={`category-pill ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
          style={{ background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)', color: '#374151' }}
        >
          📋 All ({notes.length})
        </button>
        {categories.map(cat => {
          const count = notes.filter(n => n.category === cat.value).length;
          return (
            <button
              key={cat.value}
              className={`category-pill ${cat.value} ${filterCategory === cat.value ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat.value)}
            >
              {cat.icon} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="empty-notes">
          {notes.length === 0 ? (
            <>
              <div className="empty-notes-icon">📝</div>
              <p>No notes yet</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Start documenting your farm activities!
              </p>
            </>
          ) : (
            <>
              <div className="empty-notes-icon">🔍</div>
              <p>No notes match your search</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Try adjusting your filters
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => {
            const categoryInfo = getCategoryInfo(note.category);
            return (
              <div 
                key={note.id} 
                className={`note-card ${note.category}`}
              >
                <div className="note-header">
                  <div className="note-title-section">
                    <h4 className="note-title">{note.title}</h4>
                    <span className={`note-category-badge ${note.category}`}>
                      {categoryInfo.icon} {categoryInfo.label}
                    </span>
                  </div>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleEditNote(note)}
                      className="edit-btn"
                      title="Edit note"
                      aria-label="Edit note"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="delete-note-btn"
                      title="Delete note"
                      aria-label="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="note-content">{note.content}</p>
                <div className="note-footer">
                  <span className="note-date">
                    📅 {formatDate(note.createdAt)}
                  </span>
                  {note.updatedAt !== note.createdAt && (
                    <span className="note-date" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                      ✏️ {new Date(note.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notepad;
