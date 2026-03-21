import { NotificationsResponse } from '../types';

const NOTIFICATIONS_API_BASE_URL =
  import.meta.env.VITE_NOTIFICATIONS_API || 'http://localhost:4004';

let notificationsAuthToken: string | null = null;

export const setNotificationsAuthToken = (token: string | null) => {
  notificationsAuthToken = token;
};

const buildHeaders = () => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (notificationsAuthToken) {
    headers.set('Authorization', `Bearer ${notificationsAuthToken}`);
  }

  return headers;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${NOTIFICATIONS_API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message)
        : 'Unable to complete the notifications request.';
    throw new Error(message);
  }

  return payload as T;
};

export const fetchMyNotifications = async (unreadOnly?: boolean, limit?: number) => {
  const query = new URLSearchParams();

  if (typeof unreadOnly === 'boolean') {
    query.set('unreadOnly', String(unreadOnly));
  }

  if (typeof limit === 'number') {
    query.set('limit', String(limit));
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request<NotificationsResponse>(`/notifications/me${suffix}`, {
    method: 'GET',
  });
};

export const markNotificationRead = async (id: string) =>
  request<void>(`/notifications/${id}/read`, {
    method: 'PATCH',
  });

export const markAllNotificationsRead = async () =>
  request<void>('/notifications/read-all', {
    method: 'PATCH',
  });
