import React from 'react';
import './TaskCardSkeleton.css';

function TaskCardSkeleton() {
  return (
    <div className="task-card-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-badge"></div>
        <div className="skeleton-menu"></div>
      </div>
      <div className="skeleton-title"></div>
      <div className="skeleton-tags">
        <div className="skeleton-tag"></div>
        <div className="skeleton-tag"></div>
      </div>
      <div className="skeleton-details"></div>
      <div className="skeleton-footer">
        <div className="skeleton-time"></div>
        <div className="skeleton-deadline"></div>
      </div>
    </div>
  );
}

export default TaskCardSkeleton;
