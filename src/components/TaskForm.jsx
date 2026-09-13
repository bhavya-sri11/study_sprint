import React, { useState } from 'react';

export default function TaskForm({ onAddTask, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Validation errors state
  const [errors, setErrors] = useState({
    title: '',
    subject: '',
    dueDate: ''
  });

  const popularSubjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Engineering',
    'Biology',
    'Chemistry',
    'Economics',
    'Literature'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      title: !title.trim() ? 'Task title is required.' : '',
      subject: !subject.trim() ? 'Subject is required.' : '',
      dueDate: !dueDate ? 'Due date is required.' : ''
    };

    setErrors(newErrors);

    // If any field has an error, stop submission
    if (newErrors.title || newErrors.subject || newErrors.dueDate) {
      return;
    }

    onAddTask({
      title: title.trim(),
      subject: subject.trim(),
      due_date: dueDate
    }, () => {
      // Reset form on success
      setTitle('');
      setSubject('');
      setDueDate('');
      setErrors({ title: '', subject: '', dueDate: '' });
    });
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section className="form-card">
      <div className="form-card-header">
        <div className="icon-badge">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2 className="form-title">Add New Study Task</h2>
          <p className="form-subtitle">Record coursework, reading assignments, lab reports, or exams</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="task-form" noValidate>
        <div className="form-grid">
          {/* Task Title */}
          <div className="form-group full-width">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Read Chapter 4 on Neural Networks & complete quiz"
              value={title}
              onChange={(e) => handleFieldChange('title', e.target.value, setTitle)}
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Subject */}
          <div className="form-group">
            <label htmlFor="task-subject" className="form-label">
              Subject / Course <span className="required-star">*</span>
            </label>
            <input
              id="task-subject"
              type="text"
              list="subject-suggestions"
              className={`form-input ${errors.subject ? 'input-error' : ''}`}
              placeholder="e.g., Computer Science or MATH 101"
              value={subject}
              onChange={(e) => handleFieldChange('subject', e.target.value, setSubject)}
              disabled={isSubmitting}
            />
            <datalist id="subject-suggestions">
              {popularSubjects.map((sub) => (
                <option key={sub} value={sub} />
              ))}
            </datalist>
            {errors.subject && <span className="error-message">{errors.subject}</span>}
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="task-duedate" className="form-label">
              Due Date <span className="required-star">*</span>
            </label>
            <input
              id="task-duedate"
              type="date"
              className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
              value={dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value, setDueDate)}
              disabled={isSubmitting}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                <span>Adding Task...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
