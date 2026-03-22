import { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'demo-1',
    userId: 'demo-user',
    title: 'Possible item match found',
    message: 'A black backpack reported near the library may match your lost item post.',
    type: 'MATCH',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'demo-2',
    userId: 'demo-user',
    title: 'Post reminder',
    message: 'Remember to close your found item post once the owner confirms collection.',
    type: 'REMINDER',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];
