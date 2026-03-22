import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

const links = [
  { to: '/dashboard', label: 'Feed', hint: 'Campus activity' },
  { to: '/posts/new', label: 'Create Post', hint: 'Report an item' },
  { to: '/my-posts', label: 'My Posts', hint: 'Manage yours' },
  { to: '/my-claims', label: 'My Claims', hint: 'Track requests' },
  { to: '/received-claims', label: 'Received Claims', hint: 'Review ownership' },
  { to: '/notifications', label: 'Notifications', hint: 'Match alerts' },
  { to: '/profile', label: 'Profile', hint: 'Settings' },
];

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sticky top-24 h-fit space-y-4">
      <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-card">
        <div className="flex items-center gap-3 rounded-[1.25rem] bg-slate-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-ink text-base font-bold text-white">
            {(user?.name || user?.fullName || user?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{user?.name || user?.fullName || 'Campus User'}</p>
            <p className="truncate text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-card">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-[1.2rem] px-4 py-3 transition hover:bg-slate-100',
                  isActive && 'bg-ink text-white hover:bg-ink',
                  !isActive && 'text-slate-700',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <p className={cn('text-sm font-semibold', isActive ? 'text-white' : 'text-slate-700')}>{link.label}</p>
                  <p className={cn('mt-1 text-xs', isActive ? 'text-slate-200' : 'text-slate-500')}>{link.hint}</p>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
