import React, { useState, useEffect, useRef } from 'react';
import { useTask } from '../context/TaskContext';
import TaskModal from './TaskModal';
import ConfirmDialog from './ConfirmDialog';
import './TaskCard.css';

function TaskCard({ task, onEdit }) {
  const { deleteTask, markAsFinished, updateTask } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUpdatedTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa500';
      case 'low': return '#4CAF50';
      default: return '#8b7bb8';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'finished': return 'FINISHED';
      case 'missed': return 'MISSED';
      case 'ongoing': return 'TO-DO';
      default: return 'TO-DO';
    }
  };

  const handleDelete = () => {
    setConfirmDialog(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    setConfirmDialog(false);
  };

  const handleMarkFinished = () => {
    markAsFinished(task.id);
    setShowMenu(false);
  };

  const handleChangeStatus = (newStatus) => {
    updateTask(task.id, { status: newStatus });
    setShowMenu(false);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog(false)}
        confirmText="Delete"
        type="danger"
      />
      
      <div className={`task-card ${task.status} priority-${task.priority || 'medium'}`} onClick={() => setShowModal(true)}>
      <div className="task-card-header">
        <div className="task-badges">
          <span 
            className="task-category" 
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {getStatusLabel(task.status)}
          </span>
          <span className={`priority-indicator priority-${task.priority || 'medium'}`}>
            {task.priority?.toUpperCase() || 'MEDIUM'}
          </span>
        </div>
        <div className="task-menu-container" ref={menuRef}>
          <button 
            className="task-menu" 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            ⋯
          </button>
          {showMenu && (
            <div className="task-menu-dropdown">
              {task.status !== 'finished' && (
                <button onClick={handleMarkFinished}>✓ Mark Finished</button>
              )}
              {task.status === 'finished' && (
                <button onClick={() => handleChangeStatus('ongoing')}>↻ Mark Ongoing</button>
              )}
              {task.status === 'missed' && (
                <button onClick={() => handleChangeStatus('ongoing')}>↻ Mark Ongoing</button>
              )}
              <button onClick={() => { setShowMenu(false); onEdit && onEdit(task); }}>
                ✎ Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">🗑 Delete</button>
            </div>
          )}
        </div>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="task-tag">{tag}</span>
          ))}
        </div>
      )}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="task-subtasks-preview">
          <span className="subtasks-progress">
            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks completed
          </span>
        </div>
      )}
      {task.details && <p className="task-details">{task.details}</p>}
      <div className="task-footer">
        <p className="task-time">last edited {formatUpdatedTime(task.updatedAt)}</p>
        {task.deadline && (
          <p className="task-deadline">
            📅 {formatDate(task.deadline)}
          </p>
        )}
      </div>

      <TaskModal 
        task={task}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
    </>
  );
}

export default TaskCard;
