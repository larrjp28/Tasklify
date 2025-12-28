import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm() {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ title, deadline, details });
  };

  return (
    <div className="task-form">
      <h2 className="form-title">Form Add/Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eat egg"
          />
        </div>

        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Wednesday, 6 December 2023"
          />
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

        <button type="submit" className="submit-btn">
          💾
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
