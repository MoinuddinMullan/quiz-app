import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/quiz/ML', label: 'Active Quiz', icon: 'terminal' },
  { to: '/history', label: 'History', icon: 'history' },
  { to: '/profile', label: 'Profile', icon: 'account_circle' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline-variant/30 bg-surface/85 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-around px-2 py-2 md:justify-end md:gap-8 md:px-8">
        {navItems.map(({ to, label, icon }) => {
          const isActive = location.pathname.startsWith(to) || (to === '/dashboard' && location.pathname === '/');
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] transition ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'text-primary' : ''}`}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
