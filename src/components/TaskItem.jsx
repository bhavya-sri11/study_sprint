import React from 'react';
import { getSubjectColor } from '../utils/subjectColors';

export default function TaskItem({
  task,
  onToggleStatus,
  onDeleteTask,
  onStartSprint,
  isActionLoading,
}) {
  const { id, title, subject, due_date, completed } = task;

  // Format the due date nicely for students
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const cleanDate = String(dateString).split('T')[0];
      const [year, month, day] = cleanDate.split('-').map(Number);
      if (!year || !month || !day) return dateString;
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Determine urgency status
  const getUrgency = () => {
    if (completed || !due_date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cleanDate = String(due_date).split('T')[0];
    const [year, month, day] = cleanDate.split('-').map(Number);
    if (!year || !month || !day) return null;

    const taskDate = new Date(year, month - 1, day);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { type: 'overdue', label: 'Overdue' };
    if (diffDays === 0) return { type: 'today', label: 'Due Today' };
    if (diffDays === 1) return { type: 'tomorrow', label: 'Due Tomorrow' };
    return null;
  };

  const urgency = getUrgency();
  const subjectStyle = getSubjectColor(subject);

  return (
    <div className={`task-item ${completed ? 'task-completed' : 'task-pending'}`}>
      <div className="task-main">
        <div className="task-header-row">
          <span
            className="task-subject-badge"
            style={{
              backgroundColor: subjectStyle.bg,
              color: subjectStyle.text,
              border: `1px solid ${subjectStyle.border}`,
            }}
          >
            {subject}
          </span>

          <div className="task-status-badges">
            {urgency && (
              <span className={`badge badge-urgency badge-${urgency.type}`}>
                <span className="badge-dot"></span>
                {urgency.label}
              </span>
            )}
            <span className={`badge ${completed ? 'badge-completed' : 'badge-pending'}`}>
              <span className="badge-dot"></span>
              {completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>

        <h3 className={`task-title ${completed ? 'title-strikethrough' : ''}`}>
          {title}
        </h3>

        <div className="task-meta">
          <span className="task-date">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Due: {formatDisplayDate(due_date)}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {/* Sprint Button to link task to Pomodoro timer */}
        {onStartSprint && !completed && (
          <button
            type="button"
            onClick={() => onStartSprint(task)}
            className="btn btn-sm btn-sprint-action"
            title="Start a 25-minute Pomodoro Sprint on this task"
          >
            <span>⚡ Sprint</span>
          </button>
        )}

        {/* Toggle Complete / Uncomplete button */}
        <button
          onClick={() => onToggleStatus(task)}
          disabled={isActionLoading}
          className={`btn btn-sm ${completed ? 'btn-uncomplete' : 'btn-complete'}`}
          title={completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {completed ? (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4v6h6"></path>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>Mark Pending</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Mark Complete</span>
            </>
          )}
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDeleteTask(id)}
          disabled={isActionLoading}
          className="btn btn-sm btn-delete"
          title="Delete task from Supabase"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
