import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import './TaskModal.css';

function TaskModal({ task, isOpen, onClose }) {
  const { updateTask, deleteTask, markAsFinished } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    updateTask(task.id, editedTask);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleMarkFinished = () => {
    markAsFinished(task.id);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Task Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={editedTask.title || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Deadline:</label>
                <input
                  type="datetime-local"
                  value={editedTask.deadline || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Priority:</label>
                <select
                  value={editedTask.priority || 'medium'}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editedTask.status || 'ongoing'}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                  <option value="missed">Missed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Details:</label>
                <textarea
                  value={editedTask.details || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, details: e.target.value })}
                  rows="4"
                />
              </div>
            </>
          ) : (
            <>
              <div className="detail-row">
                <strong>Title:</strong>
                <span>{task.title}</span>
              </div>

              <div className="detail-row">
                <strong>Status:</strong>
                <span className={`status-badge ${task.status}`}>
                  {task.status?.toUpperCase()}
                </span>
              </div>

              <div className="detail-row">
                <strong>Priority:</strong>
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority?.toUpperCase()}
                </span>
              </div>

              <div className="detail-row">
                <strong>Deadline:</strong>
                <span>{formatDate(task.deadline)}</span>
              </div>

              <div className="detail-row">
                <strong>Created:</strong>
                <span>{formatDate(task.createdAt)}</span>
              </div>

              <div className="detail-row">
                <strong>Last Updated:</strong>
                <span>{formatDate(task.updatedAt)}</span>
              </div>

              {task.details && (
                <div className="detail-section">
                  <strong>Details:</strong>
                  <p className="details-text">{task.details}</p>
                </div>
              )}

              {task.subtasks && task.subtasks.length > 0 && (
                <div className="detail-section">
                  <strong>Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}):</strong>
                  <div className="subtasks-list-modal">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="subtask-item-modal">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => {
                            const updatedSubtasks = task.subtasks.map(st =>
                              st.id === subtask.id ? { ...st, completed: !st.completed } : st
                            );
                            updateTask(task.id, { subtasks: updatedSubtasks });
                          }}
                        />
                        <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}>
                          {subtask.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="detail-section">
                  <strong>Tags:</strong>
                  <div className="tags-display">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {task.recurrence && task.recurrence !== 'none' && (
                <div className="detail-row">
                  <strong>Recurrence:</strong>
                  <span className="recurrence-badge">{task.recurrence}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSave} className="save-btn">
                💾 Save
              </button>
            </>
          ) : (
            <>
              <button onClick={handleDelete} className="delete-btn">
                🗑️ Delete
              </button>
              {task.status !== 'finished' && (
                <button onClick={handleMarkFinished} className="finish-btn">
                  ✓ Mark Finished
                </button>
              )}
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                ✎ Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
