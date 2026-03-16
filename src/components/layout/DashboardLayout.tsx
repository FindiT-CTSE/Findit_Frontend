import { Link, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,155,117,0.15),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)]">
      <div className="container-shell py-6">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-card backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/" className="text-sm font-semibold text-brand-700">
              Back to public site
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-ink">Campus command center</h1>
            <p className="text-sm text-slate-600">
              Manage reports, follow matches, and keep the lost & found workflow moving.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
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
