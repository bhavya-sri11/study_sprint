/**
 * Export study tasks to standard iCalendar (.ics) format
 * Compatible with Google Calendar, Apple Calendar, and Microsoft Outlook.
 */
export function exportToICalendar(tasks, filename = 'studysprint-schedule.ics') {
  if (!tasks || tasks.length === 0) {
    alert('No tasks to export.');
    return;
  }

  const pad = (n) => String(n).padStart(2, '0');

  const events = tasks
    .filter((t) => t.due_date)
    .map((task) => {
      // due_date is YYYY-MM-DD
      const cleanDate = String(task.due_date).split('T')[0];
      const [year, month, day] = cleanDate.split('-');
      if (!year || !month || !day) return null;

      const dateStr = `${year}${pad(month)}${pad(day)}`;
      const uid = `studysprint-${task.id}@studysprint.app`;
      const summary = `[${task.subject}] ${task.title}`;
      const description = `StudySprint Task for course: ${task.subject}\\nStatus: ${
        task.completed ? 'Completed' : 'Pending'
      }`;

      return [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dateStr}T000000Z`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `STATUS:${task.completed ? 'COMPLETED' : 'CONFIRMED'}`,
        'END:VEVENT',
      ].join('\r\n');
    })
    .filter(Boolean)
    .join('\r\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudySprint//University Task Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Export study tasks to CSV format for Excel, Google Sheets, or printing.
 */
export function exportToCSV(tasks, filename = 'studysprint-tasks.csv') {
  if (!tasks || tasks.length === 0) {
    alert('No tasks to export.');
    return;
  }

  const headers = ['ID', 'Task Title', 'Subject', 'Due Date', 'Status', 'Created At'];
  const rows = tasks.map((task) => [
    task.id,
    `"${(task.title || '').replace(/"/g, '""')}"`,
    `"${(task.subject || '').replace(/"/g, '""')}"`,
    task.due_date || '',
    task.completed ? 'Completed' : 'Pending',
    task.created_at || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
