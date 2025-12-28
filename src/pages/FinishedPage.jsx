import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './FinishedPage.css';

function FinishedPage() {
  const { getTasksByStatus } = useTask();
  const finishedTasks = getTasksByStatus('finished');

  const sortedTasks = [...finishedTasks].sort((a, b) => 
    new Date(b.finishedAt || b.updatedAt) - new Date(a.finishedAt || a.updatedAt)
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Finished Tasks</h1>
        <p>Completed tasks - Great job! 🎉</p>
      </div>

      {finishedTasks.length > 0 ? (
        <div className="tasks-content">
          <h2 className="section-title">Completed ({finishedTasks.length})</h2>
          <div className="tasks-grid">
            {sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h2>✓</h2>
          <p>No finished tasks yet. Complete some tasks to see them here!</p>
        </div>
      )}
    </div>
  );
}

export default FinishedPage;
