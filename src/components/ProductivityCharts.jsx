import React, { useMemo } from 'react';
import { useTask } from '../context/TaskContext';
import './ProductivityCharts.css';

function ProductivityCharts() {
  const { tasks } = useTask();

  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter tasks by time period
    const last7Days = tasks.filter(t => new Date(t.finishedAt) >= sevenDaysAgo && t.status === 'finished');
    const last30Days = tasks.filter(t => new Date(t.finishedAt) >= thirtyDaysAgo && t.status === 'finished');

    // Tasks by status
    const byStatus = {
      ongoing: tasks.filter(t => t.status === 'ongoing').length,
      finished: tasks.filter(t => t.status === 'finished').length,
      missed: tasks.filter(t => t.status === 'missed').length,
    };

    // Tasks by priority
    const byPriority = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    // Completion rate
    const totalTasksEver = tasks.length;
    const completionRate = totalTasksEver > 0 
      ? Math.round((byStatus.finished / totalTasksEver) * 100) 
      : 0;

    // Daily completion for last 7 days
    const dailyCompletion = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = tasks.filter(t => {
        if (!t.finishedAt || t.status !== 'finished') return false;
        const finishedDate = new Date(t.finishedAt);
        return finishedDate >= dayStart && finishedDate <= dayEnd;
      }).length;

      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        count,
      };
    }).reverse();

    const maxDailyCount = Math.max(...dailyCompletion.map(d => d.count), 1);

    return {
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      byStatus,
      byPriority,
      completionRate,
      dailyCompletion,
      maxDailyCount,
      totalTasks: totalTasksEver,
    };
  }, [tasks]);

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="productivity-charts">
      <h2 className="charts-title">📊 Productivity Statistics</h2>

      <div className="charts-grid">
        {/* Completion Overview */}
        <div className="chart-card">
          <h3>Completion Overview</h3>
          <div className="stat-row">
            <span>Last 7 days</span>
            <strong>{stats.last7Days} tasks</strong>
          </div>
          <div className="stat-row">
            <span>Last 30 days</span>
            <strong>{stats.last30Days} tasks</strong>
          </div>
          <div className="stat-row">
            <span>Overall rate</span>
            <strong className="completion-rate">{stats.completionRate}%</strong>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <div className="bar-chart">
            <div className="bar-item">
              <span className="bar-label">Ongoing</span>
              <div className="bar-container">
                <div 
                  className="bar-fill ongoing"
                  style={{ width: `${getPercentage(stats.byStatus.ongoing, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byStatus.ongoing}</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">Finished</span>
              <div className="bar-container">
                <div 
                  className="bar-fill finished"
                  style={{ width: `${getPercentage(stats.byStatus.finished, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byStatus.finished}</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">Missed</span>
              <div className="bar-container">
                <div 
                  className="bar-fill missed"
                  style={{ width: `${getPercentage(stats.byStatus.missed, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byStatus.missed}</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="chart-card">
          <h3>Priority Distribution</h3>
          <div className="bar-chart">
            <div className="bar-item">
              <span className="bar-label">High</span>
              <div className="bar-container">
                <div 
                  className="bar-fill priority-high"
                  style={{ width: `${getPercentage(stats.byPriority.high, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byPriority.high}</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">Medium</span>
              <div className="bar-container">
                <div 
                  className="bar-fill priority-medium"
                  style={{ width: `${getPercentage(stats.byPriority.medium, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byPriority.medium}</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">Low</span>
              <div className="bar-container">
                <div 
                  className="bar-fill priority-low"
                  style={{ width: `${getPercentage(stats.byPriority.low, stats.totalTasks)}%` }}
                ></div>
              </div>
              <span className="bar-value">{stats.byPriority.low}</span>
            </div>
          </div>
        </div>

        {/* Daily Activity (Last 7 Days) */}
        <div className="chart-card daily-chart">
          <h3>Daily Completion (Last 7 Days)</h3>
          <div className="daily-bars">
            {stats.dailyCompletion.map((day, index) => (
              <div key={index} className="daily-bar-item">
                <div className="daily-bar-container">
                  <div 
                    className="daily-bar-fill"
                    style={{ height: `${(day.count / stats.maxDailyCount) * 100}%` }}
                    title={`${day.count} tasks`}
                  ></div>
                </div>
                <span className="daily-bar-label">{day.day}</span>
                <span className="daily-bar-count">{day.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductivityCharts;
