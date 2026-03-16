import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const links = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/posts/new', label: 'Create Post' },
  { to: '/my-posts', label: 'My Posts' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile' },
];

export const Sidebar = () => (
  <aside className="surface-card h-fit p-4">
    <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      Workspace
    </p>
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              'block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink',
              isActive && 'bg-ink text-white hover:bg-ink hover:text-white',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
