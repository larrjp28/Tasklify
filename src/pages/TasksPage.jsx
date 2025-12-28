import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import './TasksPage.css';

function TasksPage() {
  const { tasks, deleteTask, markAsFinished, updateTask } = useTask();
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null });

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
    if (!searchTerm) return tasks;
    const term = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      (task.details && task.details.toLowerCase().includes(term))
    );
  };

  const sortTasks = (tasks) => {
    const sorted = [...tasks];
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
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));

  return (
    <div className="page">
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
      </div>

      <TaskForm editTask={editingTask} onEditComplete={() => setEditingTask(null)} />

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
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="updated">Last Updated</option>
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

        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search tasks by title or details..."
        />

        {filteredAndSortedTasks.length > 0 ? (
          <div className="tasks-grid">
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
            <h2>🔍</h2>
            <p>No tasks found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="empty-state">
            <h2>📝</h2>
            <p>No tasks yet. Create your first task above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
