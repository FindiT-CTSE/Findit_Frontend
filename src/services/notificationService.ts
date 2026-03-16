import { NotificationItem } from '../types';
import { mockNotifications } from '../utils/mock';
import { apiRequest } from './api';

export const notificationService = {
  async getNotifications() {
    try {
      return await apiRequest<NotificationItem[]>('/notifications', {
        method: 'GET',
        auth: true,
      });
    } catch {
      return mockNotifications;
    }
  },
};
