import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, showBack = false }) => {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem('quizStudent') || 'null');
  const initials = student ? student.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() : 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
          ) : null}
          <div>
            <div className="text-sm text-on-surface-variant">WebTech</div>
            <div className="text-base font-semibold text-on-surface">{title}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {subtitle ? <span className="text-xs text-on-surface-variant">{subtitle}</span> : null}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
