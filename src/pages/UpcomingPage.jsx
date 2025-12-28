import React from 'react';
import './UpcomingPage.css';

function UpcomingPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Upcoming</h1>
        <p>Tasks coming up soon</p>
      </div>

      <div className="empty-state">
        <h2>📅</h2>
        <p>No upcoming tasks yet</p>
      </div>
    </div>
  );
}

export default UpcomingPage;
