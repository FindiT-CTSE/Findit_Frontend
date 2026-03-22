import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { fetchMyNotifications } from '../../services/notificationsApi';
import { useToast } from '../../hooks/useToast';
import { storage } from '../../utils/storage';
import { ProfileSettings } from '../../types';
import { shouldToastNotification } from '../../utils/notifications';

const topLinks = [
  { to: '/dashboard', label: 'Feed' },
  { to: '/posts/new', label: 'Create' },
  { to: '/my-posts', label: 'My Posts' },
  { to: '/my-claims', label: 'My Claims' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile' },
];

export const DashboardLayout = () => {
  const { user, logout, token } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get('q') || '';
  const searchEnabled = location.pathname === '/dashboard';
  const [unreadCount, setUnreadCount] = useState(0);
  const previousUnreadCount = useRef(0);
  const seenNotificationIds = useRef<Set<string>>(new Set());
  const initialUnreadLoadStarted = useRef(false);
  const hasHandledLocationChange = useRef(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextParams = new URLSearchParams(searchParams);
    const value = event.target.value;

    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }

    navigate(
      {
        pathname: '/dashboard',
        search: nextParams.toString() ? `?${nextParams.toString()}` : '',
      },
      { replace: true },
    );
  };

  const loadUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetchMyNotifications(true, 10);
      setUnreadCount(response.count);

      const settings = storage.getProfileSettings<ProfileSettings>();

      if (!seenNotificationIds.current.size) {
        response.items.forEach((item) => seenNotificationIds.current.add(item.id));
      } else {
        response.items.forEach((item) => {
          if (!seenNotificationIds.current.has(item.id)) {
            seenNotificationIds.current.add(item.id);

            if (shouldToastNotification(item, settings)) {
              showToast({
                title: item.title,
                message: item.message,
                variant: 'info',
              });
            }
          }
        });
      }

      previousUnreadCount.current = response.count;
    } catch {
      setUnreadCount(0);
      previousUnreadCount.current = 0;
    }
  }, [showToast, token]);

  useEffect(() => {
    if (initialUnreadLoadStarted.current) return;
    initialUnreadLoadStarted.current = true;
    void loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    if (!hasHandledLocationChange.current) {
      hasHandledLocationChange.current = true;
      return;
    }
    void loadUnreadCount();
  }, [loadUnreadCount, location.pathname]);

  useEffect(() => {
    if (!token) return;

    const intervalId = window.setInterval(() => {
      void loadUnreadCount();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadUnreadCount, token]);

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      void loadUnreadCount();
    };

    window.addEventListener('notifications:updated', handleNotificationsUpdated);
    return () => window.removeEventListener('notifications:updated', handleNotificationsUpdated);
  }, [loadUnreadCount]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,124,255,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.1),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-xl font-bold text-white">
              F
            </Link>
            <label className="hidden min-w-[260px] items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
              <input
                value={searchEnabled ? searchValue : ''}
                onChange={handleSearchChange}
                placeholder={searchEnabled ? 'Search campus posts, people, places' : 'Search available on Feed'}
                disabled={!searchEnabled}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:text-slate-400"
              />
            </label>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {topLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-2xl bg-brand-50 px-6 py-3 text-sm font-semibold text-brand-700'
                    : 'rounded-2xl px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink'
                }
              >
                <span className="inline-flex items-center gap-2">
                  {link.label}
                  {link.to === '/notifications' && unreadCount > 0 ? (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 xl:block">
              {user?.name || user?.fullName || 'Campus User'}
            </div>
            <Button variant="ghost" className="border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px,minmax(0,760px),300px] lg:px-8">
        <Sidebar />

        <main className="space-y-6">
          <Outlet />
        </main>

        <aside className="sticky top-24 hidden h-fit space-y-4 lg:block">
          <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">Workspace summary</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profile</p>
                <p className="mt-2 font-semibold text-ink">{user?.role || 'Student'}</p>
                <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next step</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Create a clear lost or found post, then monitor the live campus feed for possible matches.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/80 bg-white/90 p-5 shadow-card">
            <p className="text-sm font-semibold text-ink">Shortcuts</p>
            <div className="mt-4 space-y-2">
              <Link to="/posts/new" className="block rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                Report lost item
              </Link>
              <Link to="/my-posts" className="block rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                Open my posts
              </Link>
              <Link to="/my-claims" className="block rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                Open my claims
              </Link>
              <Link to="/received-claims" className="block rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                Review received claims
              </Link>
              <Link to="/notifications" className="flex items-center justify-between rounded-[1.1rem] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                <span>View alerts</span>
                {unreadCount > 0 ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
