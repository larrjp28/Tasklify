import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './UpcomingPage.css';

function UpcomingPage() {
  const { getUpcomingTasks } = useTask();
  const upcomingTasks = getUpcomingTasks();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    });
  };

  const groupTasksByDate = () => {
    const grouped = {};
    upcomingTasks.forEach(task => {
      const dateKey = formatDate(task.deadline);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByDate();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upcoming</h1>
        <p>Tasks coming up in the next 7 days</p>
      </div>

      {upcomingTasks.length > 0 ? (
        <div className="upcoming-content">
          {Object.entries(groupedTasks).map(([date, tasks]) => (
            <div key={date} className="date-group">
              <h2 className="date-header">{date}</h2>
              <div className="tasks-grid">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>📅</h2>
          <p>No upcoming tasks in the next 7 days</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingPage;
