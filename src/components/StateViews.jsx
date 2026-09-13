import React from 'react';

export function LoadingState() {
  return (
    <div className="state-container loading-state">
      <div className="spinner-large"></div>
      <h3 className="state-title">Loading your study tasks...</h3>
      <p className="state-subtitle">Syncing with Supabase PostgreSQL</p>
      <div className="skeleton-grid">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="state-container empty-state">
      <div className="empty-icon-wrapper">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>
      <h3 className="state-title">No study tasks yet!</h3>
      <p className="state-subtitle">
        Your study planner is completely clear. Use the form above to add assignments, readings, or upcoming exams.
      </p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-container error-state">
      <div className="error-icon-wrapper">
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="state-title">Database Connection Error</h3>
      <p className="state-subtitle">
        {error || 'Unable to communicate with Supabase. Please verify your connection and database permissions.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-retry">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Try Again
        </button>
      )}
    </div>
  );
}

export function SupabaseSetupNotice() {
  return (
    <div className="setup-notice-card">
      <div className="setup-header">
        <div className="setup-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div>
          <h3 className="setup-title">Supabase Credentials Required</h3>
          <p className="setup-desc">
            To persist tasks in your Supabase project, configure your environment variables in <code className="code-tag">.env</code>.
          </p>
        </div>
      </div>

      <div className="setup-steps">
        <div className="setup-step">
          <span className="step-num">1</span>
          <div>
            <strong>Open the <code className="code-tag">.env</code> file in the project folder</strong>
            <p>Set your project URL and public anon key:</p>
            <pre className="code-block">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
            </pre>
          </div>
        </div>

        <div className="setup-step">
          <span className="step-num">2</span>
          <div>
            <strong>Verify the <code className="code-tag">public.tasks</code> table in Supabase SQL Editor:</strong>
            <pre className="code-block">
{`create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,
  due_date text not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable access for anon key
alter table public.tasks enable row level security;
create policy "Allow all operations for anon" on public.tasks 
  for all using (true) with check (true);`}
            </pre>
          </div>
        </div>

        <div className="setup-step">
          <span className="step-num">3</span>
          <div>
            <strong>Restart the Vite server</strong> after updating <code className="code-tag">.env</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
