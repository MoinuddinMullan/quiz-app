import { useEffect, useState } from 'react';

const CountdownTimer = ({ timeLeft, onTimeExpired, totalTime = 1200 }) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (timeLeft <= 60 && timeLeft > 0) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeExpired();
    }
  }, [timeLeft, onTimeExpired]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 transition-all duration-300 ${
        isWarning
          ? `border-error/60 bg-error/10 shadow-[0_0_15px_rgba(239,68,68,0.3)] ${isPulsing ? 'animate-pulse' : ''}`
          : 'border-primary/30 bg-surface-container-high'
      }`}
    >
      <div className="relative flex h-6 w-6 items-center justify-center">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <span
        className={`text-sm font-bold transition-colors duration-300 ${
          isWarning ? 'text-error' : 'text-primary'
        }`}
      >
        {formatTime(timeLeft)}
      </span>
      {timeLeft <= 60 && timeLeft > 0 && (
        <span className="ml-1 text-xs font-medium text-error">Alert</span>
      )}
    </div>
  );
};

export default CountdownTimer;
