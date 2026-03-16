import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { NotificationItem } from '../types';
import { formatDateTime } from '../utils/format';
import { notificationService } from '../services/notificationService';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response);
      setLoading(false);
    };

    void load();
  }, []);

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
        <h2 className="text-3xl font-bold text-ink">Notifications</h2>
        <p className="mt-2 text-sm text-slate-600">
          The UI is ready for backend-driven notifications and already falls back gracefully for demos.
        </p>
      </Card>

      {notifications.length ? (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                    {notification.type}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-ink">{notification.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{notification.message}</p>
                </div>
                <p className="text-sm text-slate-500">{formatDateTime(notification.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notifications yet"
          description="Future match alerts and system updates will appear here once the notification backend is connected."
        />
      )}
    </div>
  );
};
