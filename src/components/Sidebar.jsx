import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTask } from '../context/TaskContext';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored !== null) return stored === 'true';
    return window.innerWidth >= 900;
  });
  const { isDarkMode, toggleTheme } = useTheme();
  const { tasks, getTasksByStatus, getUpcomingTasks } = useTask();
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', isOpen);
  }, [isOpen]);

  // Click outside to close (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth >= 900 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          toggleBtnRef.current &&
          !toggleBtnRef.current.contains(event.target) &&
          isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
      {/* Toggle Button - hides when sidebar is open */}
      <button 
        ref={toggleBtnRef}
        className={`sidebar-toggle ${isOpen ? 'hidden' : ''}`} 
        onClick={toggleSidebar}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <span className="toggle-bars">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </span>
      </button>

      {/* Overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <span className="logo-bracket">[</span>
            <h2>Tasklify</h2>
            <span className="logo-bracket">]</span>
          </div>
          <button className="close-btn" onClick={toggleSidebar} title="Close sidebar">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const count = getCounts(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => window.innerWidth < 900 && setIsOpen(false)}
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
          <button className="theme-toggle-btn" onClick={toggleTheme} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <span className="sidebar-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            <span className="sidebar-label">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
