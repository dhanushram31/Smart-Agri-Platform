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
        <div className="notepad-title">
          <h3>📔 Farm Notepad</h3>
          <span className="farm-name">{farmName}</span>
        </div>
        <button 
          className="add-note-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Note'}
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="notepad-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Note Form */}
      {showAddForm && (
        <div className="note-form">
          <div className="form-header">
            <h4>{isEditing ? '✏️ Edit Note' : '📝 New Note'}</h4>
          </div>
          <div className="form-fields">
            <input
              type="text"
              placeholder="Note title..."
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="note-title-input"
            />
            <select
              value={currentNote.category}
              onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Write your note here..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              className="note-content-input"
              rows="6"
            />
            <div className="form-actions">
              <button 
                onClick={isEditing ? handleUpdateNote : handleAddNote}
                className="save-note-btn"
              >
                {isEditing ? '💾 Update' : '✅ Save Note'}
              </button>
              <button onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Statistics */}
      <div className="notes-stats">
        <div className="stat-item">
          <span className="stat-number">{notes.length}</span>
          <span className="stat-label">Total Notes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredNotes.length}</span>
          <span className="stat-label">Filtered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(notes.map(n => n.category)).size}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="no-notes">
            {notes.length === 0 ? (
              <>
                <div className="no-notes-icon">📝</div>
                <p>No notes yet. Start documenting your farm activities!</p>
                <button 
                  className="add-first-note-btn"
                  onClick={() => setShowAddForm(true)}
                >
                  Create Your First Note
                </button>
              </>
            ) : (
              <>
                <div className="no-notes-icon">🔍</div>
                <p>No notes match your search criteria.</p>
              </>
            )}
          </div>
        ) : (
          filteredNotes.map((note, index) => {
            const categoryInfo = getCategoryInfo(note.category);
            return (
              <div 
                key={note.id} 
                className="note-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="note-header">
                  <div className="note-category" style={{ borderColor: categoryInfo.color }}>
                    <span className="category-icon">{categoryInfo.icon}</span>
                    <span className="category-label">{categoryInfo.label}</span>
                  </div>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleEditNote(note)}
                      className="edit-note-btn"
                      title="Edit note"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      className="delete-note-btn"
                      title="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="note-content">
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-text">{note.content}</p>
                </div>
                <div className="note-footer">
                  <span className="note-date">
                    Created: {formatDate(note.createdAt)}
                  </span>
                  {note.updatedAt !== note.createdAt && (
                    <span className="note-updated">
                      Updated: {formatDate(note.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notes Count Footer */}
      {filteredNotes.length > 0 && (
        <div className="notes-footer">
          <span>
            Showing {filteredNotes.length} of {notes.length} notes
            {filterCategory !== 'all' && ` in ${getCategoryInfo(filterCategory).label}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default Notepad;
