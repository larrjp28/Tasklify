import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './MissedPage.css';

function MissedPage() {
  const { getTasksByStatus } = useTask();
  const missedTasks = getTasksByStatus('missed');

  const sortedTasks = [...missedTasks].sort((a, b) => 
    new Date(b.deadline) - new Date(a.deadline)
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Missed Tasks</h1>
        <p>Tasks that passed their deadline</p>
      </div>

      {missedTasks.length > 0 ? (
        <div className="tasks-content">
          <h2 className="section-title">Overdue ({missedTasks.length})</h2>
          <div className="tasks-grid">
            {sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h2>✓</h2>
          <p>No missed tasks! You're staying on top of things! 🌟</p>
        </div>
      )}
    </div>
  );
}

export default MissedPage;
