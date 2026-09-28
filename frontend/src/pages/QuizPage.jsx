import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import api from '../api/axios';

const QuizPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStartTime] = useState(Date.now());
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/quiz/questions/${subject}`);
        const fetchedQuestions = response.data.questions || [];
        setQuestions(fetchedQuestions);
        setAnswers(Array(fetchedQuestions.length).fill(null));
      } catch (error) {
        console.error('Error fetching questions:', error);
        navigate('/dashboard');
      }
    };

    if (subject) fetchQuestions();
  }, [subject, navigate]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || questions.length === 0) return;

    setIsSubmitting(true);

    const payload = questions.map((question, index) => ({
      questionId: question._id,
      selectedOptionId: answers[index] || null,
    }));

    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

    try {
      const response = await api.post('/quiz/submit', {
        subject,
        timeTaken,
        answers: payload,
      });
      navigate(`/results/${response.data.attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      navigate('/dashboard');
    }
  }, [isSubmitting, questions, answers, subject, quizStartTime, navigate]);

  const handleTimeExpired = useCallback(() => {
    setShowTimeoutAlert(true);
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, handleTimeExpired]);

  const currentQuestion = questions[currentIndex] || null;

  const progressWidth = useMemo(
    () => `${questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0}%`,
    [currentIndex, questions.length]
  );

  const handleSelectAnswer = (optionId) => {
    setAnswers((current) => {
      const next = [...current];
      next[currentIndex] = optionId;
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
      return;
    }

    if (window.confirm('Submit the quiz now?')) {
      handleSubmit();
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 text-on-surface">
      {showTimeoutAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-error/90 text-on-error px-4 py-3 text-center font-medium backdrop-blur-sm">
          ⏰ Time's up! Your answers have been auto-submitted.
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-30 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="material-symbols-outlined text-2xl text-on-surface"
          >
            arrow_back
          </button>
          <div className="text-sm text-on-surface-variant">WebTech</div>
          <div className="text-sm font-medium text-on-surface">Quiz Session</div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-20 md:px-8">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container/80 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-container animate-pulse" />
            <span className="text-sm text-on-surface">{subject}</span>
            <span className="text-xs text-on-surface-variant">
              Q{currentIndex + 1} of {questions.length}
            </span>
          </div>
          <CountdownTimer timeLeft={timeLeft} onTimeExpired={handleTimeExpired} totalTime={1200} />
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-surface-container-lowest">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary shadow-[0_0_20px_rgba(56,189,248,0.45)] transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container/70 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-primary-container/20 px-2 py-1 text-xs font-medium text-primary">
              {subject}
            </span>
            <span className="text-xs font-medium text-on-surface-variant">+50 XP</span>
          </div>

          <h2 className="text-[22px] font-bold leading-8 text-on-surface">{currentQuestion.questionText}</h2>

          {currentQuestion.questionText.includes('`') ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-outline-variant/40 bg-[#0b0f14] text-sm text-slate-200">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 bg-[#10171d] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-xs leading-6">{currentQuestion.questionText}</pre>
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentIndex] === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                    isSelected
                      ? 'border-primary/60 bg-primary-container/15 shadow-[0_0_20px_rgba(56,189,248,0.22)]'
                      : 'border-outline-variant/30 bg-surface-container-low/70 hover:bg-surface-container-high/60'
                  }`}
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => handleSelectAnswer(option.id)}
                    name="quiz-option"
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected ? 'border-primary bg-primary-container' : 'border-outline'
                    }`}
                  >
                    {isSelected ? <span className="h-2 w-2 rounded-full bg-on-primary-container" /> : null}
                  </span>
                  <span className="font-medium text-on-surface">
                    {option.id}. {option.text}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            className="rounded-xl border border-outline-variant/40 bg-surface-container/60 px-4 py-3 text-sm font-medium text-on-surface-variant disabled:opacity-60"
            disabled
          >
            Hint <span className="ml-1 rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface">0</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-container to-primary px-5 py-3 text-sm font-semibold text-on-primary-container disabled:opacity-60 transition"
          >
            {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
