import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { tasks, getTasksByStatus, getUpcomingTasks } = useTask();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Calculate counts
  const totalTasks = tasks.filter(t => t.status !== 'finished' && t.status !== 'missed').length;
  const upcomingCount = getUpcomingTasks().length;
  const finishedCount = getTasksByStatus('finished').length;
  const missedCount = getTasksByStatus('missed').length;

  const getCounts = (path) => {
    switch(path) {
      case '/tasks': return totalTasks;
      case '/upcoming': return upcomingCount;
      case '/finished': return finishedCount;
      case '/missed': return missedCount;
      default: return null;
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/tasks', icon: '📝', label: 'My Tasks' },
    { path: '/upcoming', icon: '📅', label: 'Upcoming' },
    { path: '/finished', icon: '✅', label: 'Finished' },
    { path: '/missed', icon: '❌', label: 'Missed' },
    { path: '/calendar', icon: '📆', label: 'Calendar' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  };

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger" onClick={toggleSidebar}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Tasklify</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const count = getCounts(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {count !== null && count > 0 && (
                  <span className="sidebar-badge">{count}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <span className="sidebar-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            <span className="sidebar-label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
