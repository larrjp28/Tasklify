import React, { useState, useRef, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskCardSkeleton from '../components/TaskCardSkeleton';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import ShortcutsHelp from '../components/ShortcutsHelp';
import './TasksPage.css';

function TasksPage() {
  const { tasks, deleteTask, markAsFinished, updateTask, loading, undoDelete, canUndo } = useTask();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [compactView, setCompactView] = useState(false);
  const searchInputRef = useRef(null);
  const titleInputRef = useRef(null);

  useKeyboardShortcuts({
    onSearch: () => searchInputRef.current?.focus(),
    onNewTask: () => titleInputRef.current?.focus(),
    onShowHelp: () => setShowShortcuts(true),
  });

  // Close shortcuts on Esc, handle undo on Ctrl+Z
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && canUndo) {
        e.preventDefault();
        undoDelete();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [canUndo, undoDelete]);

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAllTasks = () => {
    if (selectedTasks.length === filteredAndSortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredAndSortedTasks.map(t => t.id));
    }
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      action: () => {
        selectedTasks.forEach(id => deleteTask(id));
        setSelectedTasks([]);
        setBulkMode(false);
        setConfirmDialog({ isOpen: false, action: null });
      }
    });
  };

  const handleBulkComplete = () => {
    selectedTasks.forEach(id => markAsFinished(id));
    setSelectedTasks([]);
    setBulkMode(false);
  };

  const handleBulkStatusChange = (status) => {
    selectedTasks.forEach(id => updateTask(id, { status }));
    setSelectedTasks([]);
    setBulkMode(false);
  };

  const filterTasks = (tasks) => {
    let filtered = tasks;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) ||
        (task.details && task.details.toLowerCase().includes(term))
      );
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(task => 
        task.tags && task.tags.includes(tagFilter)
      );
    }
    
    return filtered;
  };

  const sortTasks = (tasks) => {
    // Always separate pinned tasks
    const pinned = tasks.filter(t => t.isPinned);
    const unpinned = tasks.filter(t => !t.isPinned);
    
    const sortArray = (arr) => {
      const sorted = [...arr];
      switch (sortBy) {
        case 'updated':
          return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        case 'deadline':
          return sorted.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
          });
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'urgency':
          // Smart urgency: combines deadline proximity and priority
          return sorted.sort((a, b) => {
            const now = Date.now();
            const priorityWeight = { high: 10000, medium: 5000, low: 1000 };
            
            const getUrgencyScore = (task) => {
              if (!task.deadline) return -1000000; // No deadline = lowest urgency
              const timeUntilDeadline = new Date(task.deadline) - now;
              const priorityScore = priorityWeight[task.priority] || 5000;
              // Closer deadline + higher priority = higher urgency score
              return priorityScore - (timeUntilDeadline / 1000 / 60); // Convert to minutes
            };
            
            return getUrgencyScore(b) - getUrgencyScore(a);
          });
        case 'alphabetical':
          return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'status':
          return sorted.sort((a, b) => a.status.localeCompare(b.status));
        default:
          return sorted;
      }
    };
    
    // Sort both groups separately, then concatenate with pinned first
    return [...sortArray(pinned), ...sortArray(unpinned)];
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));
  
  // Get unique tags from all tasks
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  return (
    <div className="page">
      <ShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Tasks"
        message={`Are you sure you want to delete ${selectedTasks.length} task(s)? This action cannot be undone.`}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ isOpen: false, action: null })}
        confirmText="Delete"
        type="danger"
      />
      
      <div className="page-header">
        <h1>My Tasks</h1>
        <p>Manage your tasks and to-dos</p>
        <div className="header-actions">
          <button 
            className="focus-mode-btn"
            onClick={() => navigate('/focus')}
            title="Enter Focus Mode"
          >
            🎯 Focus
          </button>
          {canUndo && (
            <button 
              className="undo-btn"
              onClick={undoDelete}
              title="Undo last delete (Ctrl+Z)"
            >
              ↶ Undo
            </button>
          )}
          <button 
            className="shortcuts-btn"
            onClick={() => setShowShortcuts(true)}
            title="Keyboard shortcuts (Ctrl+/)"
          >
            ⌨️
          </button>
        </div>
      </div>

      <TaskForm ref={titleInputRef} editTask={editingTask} onEditComplete={() => setEditingTask(null)} />

      <div className="tasks-list">
        <div className="tasks-header">
          <h2 className="section-title">All Tasks ({tasks.length})</h2>
          <div className="header-controls">
            <button 
              className={`bulk-mode-btn ${bulkMode ? 'active' : ''}`}
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedTasks([]);
              }}
            >
              {bulkMode ? '✓ Done' : '☑ Select'}
            </button>
            <button 
              className={`view-toggle-btn ${compactView ? 'active' : ''}`}
              onClick={() => setCompactView(!compactView)}
              title="Toggle compact view"
            >
              {compactView ? '▦' : '☰'}
            </button>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="updated">Last Updated</option>
                <option value="urgency">🔥 Urgency</option>
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">A-Z</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {bulkMode && filteredAndSortedTasks.length > 0 && (
          <div className="bulk-actions-bar">
            <button onClick={selectAllTasks} className="bulk-action-btn">
              {selectedTasks.length === filteredAndSortedTasks.length ? '☐ Deselect All' : '☑ Select All'}
            </button>
            {selectedTasks.length > 0 && (
              <>
                <span className="selected-count">{selectedTasks.length} selected</span>
                <button onClick={handleBulkComplete} className="bulk-action-btn complete">
                  ✓ Mark Complete
                </button>
                <button onClick={() => handleBulkStatusChange('ongoing')} className="bulk-action-btn ongoing">
                  ↻ Mark Ongoing
                </button>
                <button onClick={handleBulkDelete} className="bulk-action-btn delete">
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        )}

        <div className="filter-chips">
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            <button 
              className={`filter-chip ${priorityFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-chip priority-high ${priorityFilter === 'high' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('high')}
            >
              🔴 High
            </button>
            <button 
              className={`filter-chip priority-medium ${priorityFilter === 'medium' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('medium')}
            >
              🟡 Medium
            </button>
            <button 
              className={`filter-chip priority-low ${priorityFilter === 'low' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('low')}
            >
              🟢 Low
            </button>
          </div>
          
          {allTags.length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Tags:</span>
              <button 
                className={`filter-chip ${tagFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTagFilter('all')}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag}
                  className={`filter-chip ${tagFilter === tag ? 'active' : ''}`}
                  onClick={() => setTagFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <SearchBar 
          ref={searchInputRef}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search tasks by title or details..."
        />

        {loading ? (
          <div className="tasks-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredAndSortedTasks.length > 0 ? (
          <div className={`tasks-grid ${compactView ? 'compact' : ''}`}>
            {filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="task-wrapper">
                {bulkMode && (
                  <div className="task-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="task-checkbox"
                    />
                  </div>
                )}
                <TaskCard 
                  task={task} 
                  onEdit={setEditingTask}
                />
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No Results Found</h2>
            <p>No tasks match your search for "{searchTerm}"</p>
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No Tasks Yet</h2>
            <p>Get started by creating your first task above!</p>
            <div className="empty-tips">
              <p>💡 <strong>Tip:</strong> Press <kbd>Ctrl+N</kbd> to quickly create a new task</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
