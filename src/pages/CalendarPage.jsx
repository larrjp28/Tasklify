import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './CalendarPage.css';

function CalendarPage() {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getTasksForDate = (day) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === dateToCheck.getDate() &&
        taskDate.getMonth() === dateToCheck.getMonth() &&
        taskDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View your tasks by date</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={previousMonth} className="month-nav-btn">←</button>
          <h2 className="month-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="month-nav-btn">→</button>
        </div>

        <div className="calendar-grid">
          <div className="day-header">Sun</div>
          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>

          {[...Array(firstDayOfMonth)].map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}

          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const dayTasks = getTasksForDate(day);
            return (
              <div
                key={day}
                className={`calendar-day ${isToday(day) ? 'today' : ''} ${
                  dayTasks.length > 0 ? 'has-tasks' : ''
                }`}
              >
                <div className="day-number">{day}</div>
                {dayTasks.length > 0 && (
                  <div className="task-indicators">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`task-indicator ${task.status}`}
                        title={task.title}
                      >
                        •
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="task-indicator more">+{dayTasks.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-dot ongoing">•</span> Ongoing
          </div>
          <div className="legend-item">
            <span className="legend-dot finished">•</span> Finished
          </div>
          <div className="legend-item">
            <span className="legend-dot missed">•</span> Missed
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
