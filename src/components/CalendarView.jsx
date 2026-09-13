import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { getSubjectColor } from '../utils/subjectColors';

export default function CalendarView({
  tasks,
  onToggleStatus,
  onDeleteTask,
  onStartSprint,
  actionLoadingId,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month & total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group tasks by date string (YYYY-MM-DD)
  const tasksByDate = {};
  tasks.forEach((task) => {
    if (!task.due_date) return;
    const cleanDate = String(task.due_date).split('T')[0];
    if (!tasksByDate[cleanDate]) {
      tasksByDate[cleanDate] = [];
    }
    tasksByDate[cleanDate].push(task);
  });

  // Helper to format date string for day cell
  const pad = (n) => String(n).padStart(2, '0');

  // Days grid cells
  const calendarCells = [];
  // Empty slots for days before 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  for (let day = 1; day <= totalDays; day++) {
    const cellDateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    const dayTasks = tasksByDate[cellDateStr] || [];
    const isToday = cellDateStr === todayStr;
    const isSelected = cellDateStr === selectedDateStr;

    calendarCells.push(
      <div
        key={cellDateStr}
        className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${
          dayTasks.length > 0 ? 'has-tasks' : ''
        }`}
        onClick={() => setSelectedDateStr(cellDateStr === selectedDateStr ? null : cellDateStr)}
      >
        <div className="cell-header">
          <span className="day-number">{day}</span>
          {dayTasks.length > 0 && (
            <span className="cell-task-count">{dayTasks.length}</span>
          )}
        </div>

        <div className="cell-task-dots">
          {dayTasks.slice(0, 3).map((t) => {
            const color = getSubjectColor(t.subject);
            return (
              <span
                key={t.id}
                className="task-dot"
                style={{ backgroundColor: color.dot }}
                title={`${t.subject}: ${t.title}`}
              ></span>
            );
          })}
          {dayTasks.length > 3 && <span className="more-dots">+{dayTasks.length - 3}</span>}
        </div>
      </div>
    );
  }

  // Filter tasks for selected date if any
  const selectedDayTasks = selectedDateStr ? (tasksByDate[selectedDateStr] || []) : [];

  return (
    <div className="calendar-view-container">
      <div className="calendar-controls">
        <div className="calendar-nav">
          <button type="button" className="btn btn-sm btn-nav" onClick={handlePrevMonth}>
            ‹
          </button>
          <h2 className="calendar-month-title">
            {monthNames[month]} {year}
          </h2>
          <button type="button" className="btn btn-sm btn-nav" onClick={handleNextMonth}>
            ›
          </button>
        </div>

        <button type="button" className="btn btn-sm btn-today" onClick={handleToday}>
          Today
        </button>
      </div>

      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid">{calendarCells}</div>

      {/* Selected Day Task Drawer */}
      {selectedDateStr && (
        <div className="selected-date-section">
          <div className="selected-date-header">
            <h3 className="selected-date-title">
              Tasks Due on {selectedDateStr} ({selectedDayTasks.length})
            </h3>
            <button
              type="button"
              className="btn-clear-date"
              onClick={() => setSelectedDateStr(null)}
            >
              Close ✕
            </button>
          </div>

          {selectedDayTasks.length === 0 ? (
            <p className="no-day-tasks">No tasks scheduled for this day.</p>
          ) : (
            <div className="tasks-grid">
              {selectedDayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onDeleteTask={onDeleteTask}
                  onStartSprint={onStartSprint}
                  isActionLoading={actionLoadingId === task.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
