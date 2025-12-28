import React, { useState } from 'react';
import './Navigation.css';

function Navigation() {
  const [activeNav, setActiveNav] = useState('Dashboard');

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
    </nav>
  );
}

export default Navigation;
