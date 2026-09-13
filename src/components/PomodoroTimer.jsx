import React, { useState, useEffect, useRef } from 'react';

export default function PomodoroTimer({ activeTask, onClearActiveTask }) {
  const SPRINT_DURATION = 25 * 60; // 25 minutes
  const BREAK_DURATION = 5 * 60;   // 5 minutes

  const [mode, setMode] = useState('sprint'); // 'sprint' | 'break'
  const [timeLeft, setTimeLeft] = useState(SPRINT_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const totalTime = mode === 'sprint' ? SPRINT_DURATION : BREAK_DURATION;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  // Play pleasant notification chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio context blocked or unsupported
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      if (mode === 'sprint') {
        alert('🎉 Study Sprint completed! Take a 5-minute break.');
        switchMode('break');
      } else {
        alert('☕ Break is over! Ready for another Study Sprint?');
        switchMode('sprint');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  // If a new task is linked, auto-switch to sprint mode and open
  useEffect(() => {
    if (activeTask) {
      setIsMinimized(false);
    }
  }, [activeTask]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'sprint' ? SPRINT_DURATION : BREAK_DURATION);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'sprint' ? SPRINT_DURATION : BREAK_DURATION);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`pomodoro-widget ${isMinimized ? 'minimized' : ''}`}>
      <div className="pomodoro-header">
        <div className="pomodoro-title-group">
          <span className="pomodoro-icon">⏱️</span>
          <h3 className="pomodoro-heading">
            {mode === 'sprint' ? 'Study Sprint' : 'Rest Break'}
          </h3>
        </div>
        <div className="pomodoro-window-actions">
          <button
            type="button"
            className="pomodoro-btn-icon"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand timer' : 'Minimize timer'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="pomodoro-body">
          {/* Mode Selector Tabs */}
          <div className="pomodoro-tabs">
            <button
              type="button"
              className={`pomodoro-tab ${mode === 'sprint' ? 'active' : ''}`}
              onClick={() => switchMode('sprint')}
            >
              25m Focus Sprint
            </button>
            <button
              type="button"
              className={`pomodoro-tab ${mode === 'break' ? 'active' : ''}`}
              onClick={() => switchMode('break')}
            >
              5m Break
            </button>
          </div>

          {/* Active Task Link Banner */}
          {activeTask && (
            <div className="active-task-banner">
              <div className="active-task-info">
                <span className="active-task-label">Currently Sprinting On:</span>
                <span className="active-task-name">[{activeTask.subject}] {activeTask.title}</span>
              </div>
              <button
                type="button"
                className="btn-clear-active"
                onClick={onClearActiveTask}
                title="Unlink task"
              >
                ✕
              </button>
            </div>
          )}

          {/* Timer Clock Display */}
          <div className="pomodoro-clock">
            <span className="clock-digits">{formatTime(timeLeft)}</span>
            <div className="pomodoro-progress-bar">
              <div
                className="pomodoro-progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="pomodoro-controls">
            <button
              type="button"
              className={`btn btn-sm ${isRunning ? 'btn-pause' : 'btn-start'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Start Sprint</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-reset"
              onClick={handleReset}
              title="Reset session"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
