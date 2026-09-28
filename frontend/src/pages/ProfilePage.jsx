import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    api.get('/results/history')
      .then(({ data }) => setAttempts(data.attempts || []))
      .catch(() => setAttempts([]));
  }, []);

  const earnedMarks = attempts.reduce((sum, attempt) => sum + Number(attempt.score || 0), 0);
  const initials = (student?.name || 'Student')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <Header title="Profile" subtitle="Account" />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-24 md:px-8">
        <div className="mb-6">
          <p className="text-sm text-on-surface-variant">Your account and learning activity</p>
          <h1 className="mt-1 text-2xl font-semibold">Profile</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <section className="rounded-xl border border-outline-variant/30 bg-surface-container/60 p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-5 border-b border-outline-variant/30 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-xl font-bold text-on-primary-container">{initials}</div>
              <div>
                <h2 className="text-xl font-semibold">{student?.name || 'Student'}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Quiz learner</p>
              </div>
            </div>
            <dl className="grid gap-5 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase text-on-surface-variant">Full name</dt>
                <dd className="mt-2 text-sm font-medium">{student?.name || 'Not available'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-on-surface-variant">Enrollment number</dt>
                <dd className="mt-2 text-sm font-medium">{student?.enrollmentNumber || 'Not available'}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container/60 p-5 md:p-8">
            <h2 className="text-lg font-semibold">Learning activity</h2>
            <dl className="mt-5 divide-y divide-outline-variant/25">
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-on-surface-variant">Quizzes completed</dt>
                <dd className="text-lg font-semibold text-primary">{attempts.length}</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-sm text-on-surface-variant">Marks earned</dt>
                <dd className="text-lg font-semibold text-primary">{earnedMarks}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 rounded-lg border border-error/40 px-4 py-2.5 text-sm font-semibold text-error hover:bg-error-container/20"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Sign out
            </button>
          </section>
        </div>

        <section className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/30 pt-5">
          <div>
            <h2 className="font-semibold">Quiz history</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Review scores and revisit completed quizzes.</p>
          </div>
          <button type="button" onClick={() => navigate('/history')} className="text-sm font-semibold text-primary hover:underline">
            View all history
          </button>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;