import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BottomNav from '../components/BottomNav';
import CategoryCard from '../components/CategoryCard';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { student } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, historyRes] = await Promise.all([
          api.get('/quiz/subjects'),
          api.get('/results/history'),
        ]);
        setSubjects(subjectsRes.data);
        setAttempts(historyRes.data.attempts || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const totalXp = attempts.reduce((sum, attempt) => sum + (attempt.score || 0) * 10, 0);
  const greetingName = student?.name || 'Student';

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <Header title="Dashboard" subtitle="Daily progress" showBack={false} />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-24 md:px-8 lg:grid-cols-3">
        <section className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/70 p-5 shadow-[0_0_30px_rgba(56,189,248,0.12)] backdrop-blur-xl lg:col-span-2">
          <div className="absolute -left-8 top-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -right-8 bottom-1 h-24 w-24 rounded-full bg-primary-container/10 blur-2xl" />
          <div className="relative">
            <p className="text-sm text-on-surface-variant">Welcome back</p>
            <h2 className="mt-1 text-2xl font-semibold text-on-surface">{greetingName} ⚡</h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-surface-container-high/80 p-3">
                <div className="text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">Level</div>
                <div className="mt-1 text-lg font-bold text-primary">12</div>
              </div>
              <div className="rounded-lg bg-surface-container-high/80 p-3">
                <div className="text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">XP</div>
                <div className="mt-1 text-lg font-bold text-primary">{totalXp}</div>
              </div>
              <div className="rounded-lg bg-surface-container-high/80 p-3">
                <div className="text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">Streak</div>
                <div className="mt-1 text-lg font-bold text-primary">{Math.min(attempts.length + 1, 7)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-2xl border border-primary/20 bg-gradient-to-r from-primary-container/20 to-surface-container/80 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Daily challenge</p>
              <h3 className="mt-1 text-lg font-semibold text-on-surface">
                {subjects[0]?.label || 'Machine Learning'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/quiz/${subjects[0]?.id || 'ML'}`)}
              className="rounded-lg bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container"
            >
              Start
            </button>
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-on-surface">Explore Quiz Subjects</h3>
            <span className="text-sm text-on-surface-variant">{subjects.length} Subjects</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => (
              <CategoryCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-outline-variant/40 bg-surface-container/60 p-4 backdrop-blur-xl lg:col-span-3">
          <h3 className="text-lg font-semibold text-on-surface">My Quiz History</h3>
          {attempts.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {attempts.map((attempt) => (
                <div key={attempt._id} className="rounded-xl bg-surface-container-high/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-on-surface">{attempt.subject}</div>
                      <div className="mt-1 text-xs text-on-surface-variant">
                        {new Date(attempt.submittedAt).toLocaleDateString()} · {attempt.timeTaken || 0}s
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">
                      {attempt.score}/{attempt.totalMarks}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/review/${attempt._id}`)}
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                  >
                    Review answers
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-on-surface-variant">No quiz attempts yet.</div>
          )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardPage;
