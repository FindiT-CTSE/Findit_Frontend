import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/format';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <Card className="p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink text-2xl font-bold text-white">
            {(user?.name || user?.fullName || user?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">{user?.name || user?.fullName || 'Campus User'}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 space-y-4 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-ink">Role:</span> {user?.role || 'Student'}
          </p>
          <p>
            <span className="font-semibold text-ink">Joined:</span> {formatDate(user?.createdAt)}
          </p>
        </div>
        <Button className="mt-8 w-full" variant="ghost" onClick={logout}>
          Logout
        </Button>
      </Card>

      <div className="space-y-6">
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-ink">Activity summary</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Active reports</p>
              <p className="mt-2 text-2xl font-bold text-ink">Auto</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recovered items</p>
              <p className="mt-2 text-2xl font-bold text-ink">Ready</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Match alerts</p>
              <p className="mt-2 text-2xl font-bold text-ink">Soon</p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-2xl font-bold text-ink">Future-ready settings</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This section is structured for future profile editing, password updates, notification preferences, and account controls.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
            Edit profile placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};
