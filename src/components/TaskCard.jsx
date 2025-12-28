import React from 'react';
import './TaskCard.css';

function TaskCard({ title, time, category = 'TO-DO' }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-category">{category}</span>
        <button className="task-menu">⋯</button>
      </div>
      <h3 className="task-title">{title}</h3>
      <p className="task-time">last edited {time}</p>
    </div>
  );
}

export default TaskCard;
