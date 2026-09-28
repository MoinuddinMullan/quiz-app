import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const formatDuration = (seconds = 0) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

const HistoryPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/results/history')
      .then(({ data }) => setAttempts(data.attempts || []))
      .catch(() => setError('Quiz history could not be loaded. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <Header title="Quiz History" subtitle={`${attempts.length} attempts`} />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-on-surface-variant">Your progress, in one place</p>
            <h1 className="mt-1 text-2xl font-semibold">Quiz History</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container"
          >
            Start a quiz
          </button>
        </div>

        {error ? <p role="alert" className="rounded-lg border border-error/40 bg-error-container/20 p-4 text-sm text-error">{error}</p> : null}
        {isLoading ? <p className="py-12 text-center text-on-surface-variant">Loading attempts...</p> : null}
        {!isLoading && !error && attempts.length === 0 ? (
          <div className="border-y border-outline-variant/30 py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">history</span>
            <p className="mt-3 text-lg font-medium">No quiz attempts yet</p>
            <p className="mt-1 text-sm text-on-surface-variant">Your completed quizzes will appear here.</p>
          </div>
        ) : null}

        {attempts.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container/50">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 border-b border-outline-variant/30 px-5 py-3 text-xs font-semibold uppercase text-on-surface-variant md:grid">
              <span>Subject</span><span>Score</span><span>Date</span><span>Duration</span><span>Review</span>
            </div>
            <div className="divide-y divide-outline-variant/20">
              {attempts.map((attempt) => {
                const total = Number(attempt.totalMarks || 0);
                const percentage = total > 0 ? Math.round((attempt.score / total) * 100) : 0;
                return (
                  <article key={attempt._id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4 md:px-5">
                    <div>
                      <div className="font-semibold">{attempt.subject}</div>
                      <div className="mt-1 text-xs text-on-surface-variant md:hidden">{new Date(attempt.submittedAt).toLocaleDateString()} · {formatDuration(attempt.timeTaken)}</div>
                    </div>
                    <div className="text-sm"><span className="font-semibold text-primary">{attempt.score}/{total}</span><span className="ml-2 text-on-surface-variant">{percentage}%</span></div>
                    <div className="hidden text-sm text-on-surface-variant md:block">{new Date(attempt.submittedAt).toLocaleDateString()}</div>
                    <div className="hidden text-sm text-on-surface-variant md:block">{formatDuration(attempt.timeTaken)}</div>
                    <button
                      type="button"
                      onClick={() => navigate(`/review/${attempt._id}`)}
                      className="justify-self-start text-sm font-semibold text-primary hover:underline md:justify-self-end"
                    >
                      Review answers
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </main>
      <BottomNav />
    </div>
  );
};

export default HistoryPage;