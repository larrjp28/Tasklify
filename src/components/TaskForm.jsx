import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import './TaskForm.css';

function TaskForm({ editTask, onEditComplete }) {
  const { addTask, updateTask } = useTask();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDeadline(editTask.deadline || '');
      setDetails(editTask.details || '');
      setPriority(editTask.priority || 'medium');
      setTags(editTask.tags ? editTask.tags.join(', ') : '');
      setRecurrence(editTask.recurrence || 'none');
      setSubtasks(editTask.subtasks || []);
      setIsEditing(true);
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const taskTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (isEditing && editTask) {
      updateTask(editTask.id, {
        title: title.trim(),
        deadline: deadline || null,
        details: details.trim(),
        priority,
        tags: taskTags,
        recurrence: recurrence !== 'none' ? recurrence : null,
        subtasks,
      });
      if (onEditComplete) onEditComplete();
    } else {
      addTask({
        title: title.trim(),
        deadline: deadline || null,
        details: details.trim(),
        priority,
        tags: taskTags,
        recurrence: recurrence !== 'none' ? recurrence : null,
        subtasks,
      });
    }

    // Reset form
    setTitle('');
    setDeadline('');
    setDetails('');
    setPriority('medium');
    setTags('');
    setRecurrence('none');
    setSubtasks([]);
    setNewSubtask('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDeadline('');
    setDetails('');
    setPriority('medium');
    setTags('');
    setRecurrence('none');
    setSubtasks([]);
    setNewSubtask('');
    setIsEditing(false);
    if (onEditComplete) onEditComplete();
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtask.trim(), completed: false }]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const toggleSubtask = (id) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  return (
    <div className="task-form">
      <h2 className="form-title">{isEditing ? 'Edit Task' : 'Form Add/Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eat egg"
            required
          />
        </div>

        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, personal, urgent (comma-separated)"
          />
        </div>

        <div className="form-group">
          <label>Recurrence:</label>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {recurrence !== 'none' && (
            <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              ℹ️ Task will automatically recreate when marked as finished
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="type something here"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Subtasks:</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              placeholder="Add a subtask..."
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addSubtask} className="add-subtask-btn">
              + Add
            </button>
          </div>
          {subtasks.length > 0 && (
            <div className="subtasks-list">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="subtask-item">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                  />
                  <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}>
                    {subtask.text}
                  </span>
                  <button type="button" onClick={() => removeSubtask(subtask.id)} className="remove-subtask-btn">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {isEditing ? '💾 Update' : '💾 Add'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
