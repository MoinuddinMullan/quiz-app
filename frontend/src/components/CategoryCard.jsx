import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ subject }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/quiz/${subject.id}`)}
      className="flex w-full items-center gap-4 rounded-xl border border-outline-variant/40 bg-surface-container/60 p-4 text-left backdrop-blur-xl transition hover:bg-surface-container-high/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
        <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-lg font-semibold text-on-surface">{subject.label}</div>
        <div className="mt-1 flex items-center gap-3 text-xs text-on-surface-variant">
          <span>{subject.questionCount} questions</span>
          <span className="rounded-full bg-secondary-container px-2 py-1 text-[10px] font-medium text-on-surface">
            {subject.difficulty}
          </span>
        </div>
      </div>

      <span className="material-symbols-outlined text-xl text-on-surface-variant">chevron_right</span>
    </button>
  );
};

export default CategoryCard;
