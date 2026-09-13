import React, { useState, useMemo } from 'react';
import TaskItem from './TaskItem';
import { exportToICalendar, exportToCSV } from '../utils/exportUtils';
import { getSubjectColor } from '../utils/subjectColors';

export default function TaskList({
  tasks,
  onToggleStatus,
  onDeleteTask,
  onStartSprint,
  actionLoadingId,
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due-asc'); // 'due-asc' | 'due-desc' | 'subject' | 'title' | 'recent'

  // Extract unique subjects with counts
  const subjectsWithCounts = useMemo(() => {
    const counts = {};
    tasks.forEach((t) => {
      const sub = t.subject?.trim() || 'Other';
      counts[sub] = (counts[sub] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  // Filter & sort tasks
  const processedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (activeFilter === 'pending' && task.completed) return false;
        if (activeFilter === 'completed' && !task.completed) return false;

        // Subject filter
        if (selectedSubject !== 'all' && task.subject !== selectedSubject) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (task.title || '').toLowerCase().includes(q);
          const matchSubject = (task.subject || '').toLowerCase().includes(q);
          if (!matchTitle && !matchSubject) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-asc') {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        }
        if (sortBy === 'due-desc') {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return b.due_date.localeCompare(a.due_date);
        }
        if (sortBy === 'subject') {
          return (a.subject || '').localeCompare(b.subject || '');
        }
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'recent') {
          return (b.created_at || '').localeCompare(a.created_at || '');
        }
        return 0;
      });
  }, [tasks, activeFilter, selectedSubject, searchQuery, sortBy]);

  return (
    <section className="task-list-section">
      {/* Header with Title and Export Actions */}
      <div className="task-list-header">
        <div className="section-title-wrapper">
          <h2 className="section-title">Coursework & Tasks</h2>
          <span className="task-count-pill">{tasks.length} total</span>
        </div>

        <div className="list-header-actions">
          <div className="export-btn-group">
            <button
              type="button"
              className="btn btn-sm btn-export"
              onClick={() => exportToICalendar(tasks)}
              title="Export all tasks to Google / Apple Calendar (.ics)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Export to Calendar (.ics)</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-export"
              onClick={() => exportToCSV(tasks)}
              title="Download tasks as spreadsheet (.csv)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="task-toolbar">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search coursework, tasks, or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-selector-wrapper">
          <label htmlFor="sort-tasks" className="sort-label">Sort by:</label>
          <select
            id="sort-tasks"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="due-asc">Closest Due Date</option>
            <option value="due-desc">Furthest Due Date</option>
            <option value="subject">Subject (A-Z)</option>
            <option value="title">Title (A-Z)</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Course / Subject Filter Pills */}
      {Object.keys(subjectsWithCounts).length > 0 && (
        <div className="subject-filter-container">
          <span className="subject-filter-label">Filter by Course:</span>
          <div className="subject-pills-list">
            <button
              type="button"
              className={`subject-pill ${selectedSubject === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedSubject('all')}
            >
              All Courses ({tasks.length})
            </button>
            {Object.entries(subjectsWithCounts).map(([sub, count]) => {
              const color = getSubjectColor(sub);
              const isActive = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  className={`subject-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(sub)}
                  style={{
                    backgroundColor: isActive ? color.text : color.bg,
                    color: isActive ? '#ffffff' : color.text,
                    borderColor: color.border,
                  }}
                >
                  <span
                    className="pill-dot"
                    style={{ backgroundColor: isActive ? '#ffffff' : color.dot }}
                  ></span>
                  <span>{sub}</span>
                  <span className="pill-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Filter Tabs (All, Pending, Completed) */}
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          type="button"
          className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      {/* Task Cards Grid */}
      {processedTasks.length === 0 ? (
        <div className="filter-empty-state">
          <p>
            {searchQuery || selectedSubject !== 'all' || activeFilter !== 'all'
              ? 'No tasks matching your current filters or search query.'
              : 'No tasks found.'}
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {processedTasks.map((task) => (
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
    </section>
  );
}
