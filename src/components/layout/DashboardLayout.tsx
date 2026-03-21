import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,124,255,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.1),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="container-shell py-6">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-ink text-xl font-bold text-white">
              F
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">FindIt Workspace</p>
              <h1 className="mt-1 text-2xl font-bold text-ink">Campus command center</h1>
              <p className="text-sm text-slate-600">
                Review posts, create reports, and manage your activity from one focused dashboard.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-ink">{user?.name || user?.fullName || 'Student User'}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <Sidebar />
          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
