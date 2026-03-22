import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { NotificationItem } from '../types';
import { formatDateTime } from '../utils/format';
import {
  fetchMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationsApi';
import {
  getNotificationBucket,
  getNotificationTargetPath,
  getNotificationTypeLabel,
  NotificationBucket,
} from '../utils/notifications';

const emitNotificationsUpdated = () => {
  window.dispatchEvent(new CustomEvent('notifications:updated'));
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationBucket>('all');

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !notification.read;
        return getNotificationBucket(notification.type) === activeTab;
      }),
    [activeTab, notifications],
  );

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchMyNotifications(false);
      const sortedItems = response.items
        .slice()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
      setNotifications(sortedItems);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    const targetPath = getNotificationTargetPath(notification);

    if (!notification.read) {
      setSubmittingId(notification.id);
      try {
        await markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
        );
        emitNotificationsUpdated();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : 'Unable to update notification.');
      } finally {
        setSubmittingId(null);
      }
    }

    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    setError('');

    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      emitNotificationsUpdated();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to mark all notifications as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Notifications</h2>
            <p className="mt-2 text-sm text-slate-600">
              Stay updated with match alerts, reminders, and system messages.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-ink">{unreadCount}</p>
              <p className="text-slate-500">Unread notifications</p>
            </div>
            <Button onClick={() => void handleMarkAllRead()} disabled={!notifications.length || unreadCount === 0} loading={markingAll}>
              Mark all as read
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {([
            ['all', 'All'],
            ['unread', 'Unread'],
            ['matches', 'Matches'],
            ['claims', 'Claims'],
            ['system', 'System'],
          ] as Array<[NotificationBucket, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === value
                  ? 'bg-ink text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {error ? <Alert title="Notifications error" message={error} variant="error" /> : null}

      {visibleNotifications.length ? (
        <div className="grid gap-4">
          {visibleNotifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => void handleNotificationClick(notification)}
              className="w-full text-left"
            >
              <Card
                className={`p-6 transition ${notification.read ? 'border-slate-100 bg-white/90' : 'border-brand-100 bg-brand-50/60'}`}
              >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                    {getNotificationTypeLabel(notification.type)}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-ink">{notification.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{notification.message}</p>
                  {notification.meta?.postId ? (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Related post: {notification.meta.postId}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <p className="text-sm text-slate-500">{formatDateTime(notification.createdAt)}</p>
                  {!notification.read ? (
                    <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                      Unread
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      Read
                    </span>
                  )}
                  {submittingId === notification.id ? (
                    <span className="text-xs text-slate-500">Updating...</span>
                  ) : null}
                </div>
              </div>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description={
            activeTab === 'all'
              ? 'You do not have any notifications right now.'
              : 'No notifications match the selected category right now.'
          }
          action={
            <Link to="/profile" className="text-sm font-semibold text-brand-700">
              Review notification settings
            </Link>
          }
        />
      )}
    </div>
  );
};
