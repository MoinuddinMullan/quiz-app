import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ReviewPage = () => {
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
    return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">Loading review...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <button type="button" onClick={() => navigate(`/results/${id}`)} className="material-symbols-outlined text-2xl text-on-surface">arrow_back</button>
          <div className="text-lg font-semibold text-on-surface">Review Answers</div>
          <div className="w-8" />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pb-8 pt-20 md:grid-cols-2 md:px-8 xl:grid-cols-3">
        {result.questionResults?.map((question, index) => {
          const selected = question.selectedOptionId;
          const isCorrect = question.isCorrect;
          const correctText = question.options.find((option) => option.id === question.correctOptionId)?.text || 'No answer';

          return (
            <div key={question.questionId || index} className="rounded-2xl border border-outline-variant/30 bg-surface-container/70 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-surface-container-high px-2 py-1 text-xs font-medium text-primary">Q{index + 1}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${isCorrect ? 'bg-primary-container/20 text-primary' : 'bg-error-container/30 text-error'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              <p className="text-base font-semibold text-on-surface">{question.questionText}</p>

              <div className="mt-4 space-y-2">
                {question.options.map((option) => {
                  const isCorrectOption = option.id === question.correctOptionId;
                  const isStudentChoice = option.id === selected;

                  let classes = 'rounded-lg border px-2 py-2 text-sm';

                  if (isCorrectOption) {
                    classes += ' border-primary bg-primary-container/20 text-on-surface';
                  } else if (isStudentChoice && !isCorrect) {
                    classes += ' border-error bg-error-container/30 text-error';
                  } else {
                    classes += ' border-outline-variant/30 bg-surface-container-low/60 text-on-surface-variant';
                  }

                  if (isCorrect && isStudentChoice) {
                    classes = 'rounded-lg border border-primary bg-primary-container/20 px-2 py-2 text-sm text-on-surface';
                  }

                  return (
                    <div key={option.id} className={classes}>
                      {option.id}. {option.text}
                    </div>
                  );
                })}
              </div>

              {!isCorrect ? (
                <div className="mt-3 text-sm text-on-surface-variant">
                  Correct answer: <span className="font-medium text-primary">{correctText}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default ReviewPage;
