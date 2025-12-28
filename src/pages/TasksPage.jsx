import React from 'react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import './TasksPage.css';

function TasksPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>My Tasks</h1>
        <p>Manage your tasks and to-dos</p>
      </div>

      <TaskForm />

      <div className="tasks-list">
        <h2 className="section-title">Recent Tasks</h2>
        <div className="tasks-grid">
          <TaskCard title="CSCS 335" time="1:20 AM" />
          <TaskCard title="DSA" time="2:15 PM" />
          <TaskCard title="ITEC 199" time="11:45 AM" />
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
