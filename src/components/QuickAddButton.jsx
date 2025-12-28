import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import './QuickAddButton.css';

function QuickAddButton() {
  const { addTask } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        priority: 'medium',
        tags: [],
        details: '',
        deadline: null,
      });
      setTitle('');
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
  };

  return (
    <div className="quick-add-container">
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="quick-add-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quick add task..."
            autoFocus
            className="quick-add-input"
          />
          <div className="quick-add-actions">
            <button type="submit" className="quick-add-submit">
              ✓
            </button>
            <button type="button" onClick={handleCancel} className="quick-add-cancel">
              ✕
            </button>
          </div>
        </form>
      ) : (
        <button 
          className="quick-add-button"
          onClick={() => setIsExpanded(true)}
          title="Quick add task (Ctrl+Q)"
        >
          +
        </button>
      )}
    </div>
  );
}

export default QuickAddButton;
