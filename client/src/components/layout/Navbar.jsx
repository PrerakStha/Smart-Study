import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LINKS = [
  ['/workspace', 'Workspace'],
  ['/quizzes', 'Quizzes'],
  ['/flashcards', 'Flashcards'],
  ['/dashboard', 'Dashboard'],
];

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the avatar menu when clicking elsewhere
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="border-b border-line bg-app">
      <div className="mx-auto flex h-[4.4rem] max-w-6xl items-center justify-between px-6">
        <NavLink to="/workspace" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-surface">
            S
          </span>
          <span className="text-lg font-semibold">Smart Study</span>
        </NavLink>

        <nav className="flex items-center gap-4 text-sm sm:gap-8">
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `hidden transition sm:block ${
                  isActive ? 'font-medium text-brand' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Account menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/80 text-sm font-bold text-surface transition hover:bg-brand"
            >
              {initials(user?.name)}
            </button>

            {open && (
              <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-line bg-card p-2 shadow-xl">
                <div className="border-b border-line px-3 py-2">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-zinc-400">{user?.email}</p>
                  <p className="mt-1 text-xs capitalize text-brand">{user?.role}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}