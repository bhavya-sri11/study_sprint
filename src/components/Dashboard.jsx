import React from 'react';

export default function Dashboard({ totalTasks, completedTasks, pendingTasks }) {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="dashboard-header">
      <div className="brand-section">
        <div className="brand-badge">
          <span className="brand-dot"></span>
          <span>Semester Task Hub</span>
        </div>
        <h1 className="app-title">
          Study<span className="highlight">Sprint</span>
        </h1>
        <p className="app-description">
          A smart, simple study and task planner designed for university students to stay on top of coursework, exams, and project deadlines.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{totalTasks}</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Completed Tasks</span>
            <span className="stat-value">{completedTasks}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Tasks</span>
            <span className="stat-value">{pendingTasks}</span>
          </div>
        </div>
      </div>

      {totalTasks > 0 && (
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-title">Overall Study Progress</span>
            <span className="progress-percent">{completionPercentage}% Completed</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPercentage}%` }}
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}
    </header>
  );
}
