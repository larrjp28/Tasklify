import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from './TaskCard';
import './Dashboard.css';

function Dashboard() {
  const { tasks, getTasksByStatus } = useTask();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['Importance', 'All', 'Finished', 'Ongoing', 'Missed'];

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'Finished':
        return getTasksByStatus('finished');
      case 'Ongoing':
        return getTasksByStatus('ongoing');
      case 'Missed':
        return getTasksByStatus('missed');
      case 'Importance':
        return [...tasks].sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      case 'All':
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const finishedTasks = getTasksByStatus('finished');
  const missedTasks = getTasksByStatus('missed');
  const ongoingTasks = getTasksByStatus('ongoing');
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (finishedTasks.length / totalTasks) * 100 : 0;

  // Calculate productivity stats
  const getLast7DaysStats = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentFinished = finishedTasks.filter(task => 
      task.finishedAt && new Date(task.finishedAt) >= sevenDaysAgo
    );
    
    const recentCreated = tasks.filter(task =>
      new Date(task.createdAt) >= sevenDaysAgo
    );

    return {
      completedThisWeek: recentFinished.length,
      createdThisWeek: recentCreated.length,
    };
  };

  const weeklyStats = getLast7DaysStats();

  const getTasksByPriority = () => {
    const high = tasks.filter(t => t.priority === 'high' && t.status === 'ongoing').length;
    const medium = tasks.filter(t => t.priority === 'medium' && t.status === 'ongoing').length;
    const low = tasks.filter(t => t.priority === 'low' && t.status === 'ongoing').length;
    return { high, medium, low };
  };

  const priorityStats = getTasksByPriority();

  const getUpcomingReminders = () => {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return tasks
      .filter((task) => {
        if (!task.deadline || task.status === 'finished') return false;
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= nextDay;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      
      <div className="dashboard-layout">
        <div className="filter-sidebar">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="dashboard-panels">
          <div className="panel">
            <h3>Finished Task: {finishedTasks.length}</h3>
            <div className="panel-content">
              {finishedTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="panel-task-item">
                  ✓ {task.title}
                </div>
              ))}
              {finishedTasks.length === 0 && (
                <p className="panel-empty">No finished tasks yet</p>
              )}
            </div>
          </div>
          
          <div className="panel">
            <h3>Missed Task: {missedTasks.length}</h3>
            <div className="panel-content">
              {missedTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="panel-task-item missed">
                  ✗ {task.title}
                </div>
              ))}
              {missedTasks.length === 0 && (
                <p className="panel-empty">No missed tasks</p>
              )}
            </div>
          </div>
          
          <div className="panel">
            <h3>Reminders: {upcomingReminders.length}</h3>
            <div className="panel-content">
              {upcomingReminders.slice(0, 3).map((task) => (
                <div key={task.id} className="panel-task-item reminder">
                  ⏰ {task.title}
                </div>
              ))}
              {upcomingReminders.length === 0 && (
                <p className="panel-empty">No upcoming reminders</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <label>Progress: {finishedTasks.length} / {totalTasks} tasks completed</label>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-box">
          <div className="stat-icon">📈</div>
          <div className="stat-number">{weeklyStats.completedThisWeek}</div>
          <div className="stat-label">Completed This Week</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">➕</div>
          <div className="stat-number">{weeklyStats.createdThisWeek}</div>
          <div className="stat-label">Created This Week</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">⚠️</div>
          <div className="stat-number">{priorityStats.high}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{ongoingTasks.length}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="filtered-tasks">
        <h3 className="section-title">{activeFilter} Tasks ({filteredTasks.length})</h3>
        <div className="tasks-grid">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="no-tasks">No tasks to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
