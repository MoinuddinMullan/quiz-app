import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import QuestionMatrix from '../components/QuestionMatrix';

const getTier = (percentage) => {
  if (percentage >= 90) return 'S-Tier';
  if (percentage >= 75) return 'A-Tier';
  if (percentage >= 60) return 'B-Tier';
  return 'C-Tier';
};

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/results/${id}`);
        setResult(response.data);
      } catch (error) {
        navigate('/dashboard');
      }
    };

    if (id) fetchResult();
  }, [id, navigate]);

  if (!result) {
    return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">Loading results...</div>;
  }

  const score = Number(result.score || 0);
  const total = Number(result.totalMarks ?? result.questionResults?.length ?? 0);
  const percentage = Number(result.percentage ?? (total > 0 ? Math.round((score / total) * 100) : 0));
  const questionResults = result.questionResults || [];
  const incorrect = questionResults.filter((question) => !question.isCorrect).length;
  const circumference = 427;
  const strokeOffset = circumference - (total > 0 ? score / total : 0) * circumference;

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 text-lg font-semibold text-on-surface md:px-8">Quiz Results</div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-20 md:px-8">
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-10 top-20 h-32 w-32 rounded-full bg-primary-container/10 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-primary-container/20 px-2 py-1 text-xs font-medium text-primary">{result.subject} Level</span>
            <span className="rounded-full bg-secondary-container px-2 py-1 text-xs font-medium text-on-surface">{getTier(score)}</span>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#8ed5ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-on-surface">{score} / {total}</div>
                <div className="text-sm text-on-surface-variant">{percentage}% Accuracy</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-3xl font-bold text-on-surface">Quiz Completed!</div>
            <div className="mt-2 text-sm text-on-surface-variant">{result.subject} challenge finished.</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl bg-surface-container/70 p-4">
            <div className="text-xs text-on-surface-variant">Correct</div>
            <div className="mt-2 text-2xl font-bold text-primary">{score}</div>
          </div>
          <div className="rounded-xl bg-surface-container/70 p-4">
            <div className="text-xs text-on-surface-variant">Incorrect</div>
            <div className="mt-2 text-2xl font-bold text-error">{incorrect}</div>
          </div>
          <div className="rounded-xl bg-surface-container/70 p-4">
            <div className="text-xs text-on-surface-variant">Duration</div>
            <div className="mt-2 text-xl font-bold text-on-surface">{Math.floor((result.timeTaken || 0) / 60)}m { (result.timeTaken || 0) % 60 }s</div>
          </div>
          <div className="rounded-xl bg-surface-container/70 p-4">
            <div className="text-xs text-on-surface-variant">Accuracy</div>
            <div className="mt-2 text-2xl font-bold text-primary">{percentage}%</div>
          </div>
        </div>

        <div className="mt-6">
          <QuestionMatrix
            total={questionResults.length}
            answers={questionResults.map((question) => question.selectedOptionId ?? null)}
            currentIndex={-1}
          />
        </div>

        <div className="mt-6 space-y-3">
          <button type="button" onClick={() => navigate('/dashboard')} className="h-12 w-full rounded-xl bg-primary-container font-semibold text-on-primary-container">
            Take Another Quiz
          </button>
          <button type="button" onClick={() => navigate(`/review/${id}`)} className="h-12 w-full rounded-xl border border-outline-variant/40 bg-surface-container/60 font-semibold text-on-surface">
            Review Answers ({incorrect} Incorrect)
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="w-full text-center text-sm text-primary">
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
