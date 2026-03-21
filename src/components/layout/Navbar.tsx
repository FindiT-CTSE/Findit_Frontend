import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Button, buttonStyles } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Browse' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const visibleNavLinks = isAuthenticated ? navLinks : [];

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-slate-50/80 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white">
            F
          </div>
          <div>
            <p className="text-base font-bold text-ink">FindIt</p>
            <p className="text-xs text-slate-500">Smart Campus Lost & Found</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {visibleNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-semibold text-slate-600 transition hover:text-ink',
                  isActive && 'text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link to="/dashboard" className={buttonStyles({})}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600">
                Login
              </Link>
              <Link to="/register" className={buttonStyles({})}>
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-2xl border border-slate-200 p-3 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-slate-700" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-700" />
          <span className="mt-1.5 block h-0.5 w-5 bg-slate-700" />
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-shell flex flex-col gap-4 py-5">
            {visibleNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-700"
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={buttonStyles({ className: 'w-full' })}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={buttonStyles({ variant: 'ghost', className: 'w-full' })}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className={buttonStyles({ className: 'w-full' })}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
