import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navigation.css';

function Navigation() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    'Upcoming',
    'Lump',
    'Dashboard',
    'Calendars',
    'Finished',
    'Missed',
    'About/Profile'
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <button
          key={item}
          className={`nav-item ${activeNav === item ? 'active' : ''}`}
          onClick={() => setActiveNav(item)}
        >
          {item}
        </button>
      ))}
      <button className="theme-toggle" onClick={toggleTheme} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}

export default Navigation;
