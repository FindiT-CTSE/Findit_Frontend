import { FormEvent, useMemo, useState } from 'react';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ProfileSettings } from '../types';
import { formatDate } from '../utils/format';
import { storage } from '../utils/storage';

const defaultSettings: ProfileSettings = {
  receiveMatchAlerts: true,
  receiveSystemNotifications: true,
  receiveEmailUpdates: false,
  showOnlyOpenPostsByDefault: false,
};

export const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const storedSettings = useMemo(
    () => storage.getProfileSettings<ProfileSettings>() || defaultSettings,
    [],
  );

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || user?.name || '',
    role: user?.role || 'Student',
  });
  const [settings, setSettings] = useState<ProfileSettings>(storedSettings);
  const [error, setError] = useState('');

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!profileForm.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    updateUser({
      fullName: profileForm.fullName.trim(),
      name: profileForm.fullName.trim(),
      role: profileForm.role.trim() || 'Student',
    });

    showToast({
      title: 'Profile updated',
      message: 'Your profile details were saved on this device.',
      variant: 'success',
    });
  };

  const handleSettingsSave = (event: FormEvent) => {
    event.preventDefault();
    storage.setProfileSettings(settings);
    showToast({
      title: 'Settings saved',
      message: 'Your preferences were saved on this device.',
      variant: 'success',
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr,1.18fr]">
      <div className="space-y-6">
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

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role</p>
              <p className="mt-2 font-semibold text-ink">{user?.role || 'Student'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Joined</p>
              <p className="mt-2 font-semibold text-ink">{formatDate(user?.createdAt)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Account email</p>
              <p className="mt-2 font-semibold text-ink">{user?.email}</p>
            </div>
          </div>

          <Alert
            title="Local profile settings"
            message="This page currently saves profile edits and preferences in the frontend on this device because a backend profile-update endpoint is not yet connected."
            variant="info"
          />

          <Button className="mt-6 w-full" variant="ghost" onClick={logout}>
            Logout
          </Button>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Profile settings</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">Personal information</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Update the visible profile details used inside the app workspace.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleProfileSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                value={profileForm.fullName}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, fullName: event.target.value }))
                }
              />
              <Input
                label="Role"
                value={profileForm.role}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, role: event.target.value }))
                }
              />
            </div>

            <Input label="Email" value={user?.email || ''} disabled />

            {error ? <Alert title="Profile update failed" message={error} variant="error" /> : null}

            <Button type="submit">Save profile</Button>
          </form>
        </Card>

        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Preferences</p>
          <h3 className="mt-2 text-2xl font-bold text-ink">Notifications and workspace</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Choose how the app should behave for your account on this device.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSettingsSave}>
            <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-ink">Match alerts</p>
                <p className="mt-1 text-sm text-slate-600">Notify me when the app detects possible related posts.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.receiveMatchAlerts}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, receiveMatchAlerts: event.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-ink">System notifications</p>
                <p className="mt-1 text-sm text-slate-600">Show reminders and app-level notices inside the workspace.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.receiveSystemNotifications}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    receiveSystemNotifications: event.target.checked,
                  }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-ink">Email updates</p>
                <p className="mt-1 text-sm text-slate-600">Receive follow-up updates by email when backend delivery is connected.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.receiveEmailUpdates}
                onChange={(event) =>
                  setSettings((current) => ({ ...current, receiveEmailUpdates: event.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-ink">Default to open posts</p>
                <p className="mt-1 text-sm text-slate-600">Keep your dashboard focused on active lost and found items first.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showOnlyOpenPostsByDefault}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    showOnlyOpenPostsByDefault: event.target.checked,
                  }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300"
              />
            </label>

            <Button type="submit" variant="secondary">
              Save preferences
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
