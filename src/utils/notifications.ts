import { NotificationItem, NotificationType, ProfileSettings } from '../types';

export type NotificationBucket = 'all' | 'unread' | 'matches' | 'claims' | 'system';

const matchTypes = new Set<NotificationType>([
  'MATCH_FOUND',
  'MATCH_SCORE_UPDATED',
  'MATCH',
  'NEW_POST_NEARBY',
]);

const claimTypes = new Set<NotificationType>([
  'ITEM_CLAIMED',
  'CLAIM_APPROVED',
  'CLAIM_REJECTED',
]);

const systemTypes = new Set<NotificationType>([
  'SYSTEM',
  'ADMIN_MESSAGE',
  'ACCOUNT_SECURITY',
  'PROFILE_UPDATED',
  'POST_STATUS_CHANGED',
  'POST_EXPIRED',
  'POST_REMINDER',
  'REMINDER',
  'NEW_COMMENT_ON_POST',
]);

export const getNotificationBucket = (type: NotificationType): Exclude<NotificationBucket, 'all' | 'unread'> => {
  if (matchTypes.has(type)) return 'matches';
  if (claimTypes.has(type)) return 'claims';
  return 'system';
};

export const getNotificationTypeLabel = (type: NotificationType) => {
  switch (type) {
    case 'MATCH_FOUND':
      return 'Match Found';
    case 'MATCH_SCORE_UPDATED':
      return 'Match Updated';
    case 'NEW_COMMENT_ON_POST':
      return 'Comment';
    case 'POST_STATUS_CHANGED':
      return 'Post Status';
    case 'ITEM_CLAIMED':
      return 'Item Claimed';
    case 'CLAIM_APPROVED':
      return 'Claim Approved';
    case 'CLAIM_REJECTED':
      return 'Claim Rejected';
    case 'POST_EXPIRED':
      return 'Post Expired';
    case 'POST_REMINDER':
      return 'Reminder';
    case 'NEW_POST_NEARBY':
      return 'Nearby Post';
    case 'ADMIN_MESSAGE':
      return 'Admin Message';
    case 'ACCOUNT_SECURITY':
      return 'Security';
    case 'PROFILE_UPDATED':
      return 'Profile';
    case 'MATCH':
      return 'Match';
    case 'SYSTEM':
      return 'System';
    case 'REMINDER':
      return 'Reminder';
    default:
      return type.replace(/_/g, ' ');
  }
};

export const getNotificationTargetPath = (notification: NotificationItem) => {
  const deepLink = typeof notification.meta?.deepLink === 'string' ? notification.meta.deepLink : '';
  if (deepLink) return deepLink;

  if (notification.meta?.postId && !notification.meta.postId.startsWith('post-')) {
    return `/posts/${notification.meta.postId}`;
  }

  if (notification.meta?.claimId) {
    return '/my-posts';
  }

  return '';
};

export const shouldToastNotification = (
  notification: NotificationItem,
  settings?: ProfileSettings | null,
) => {
  if (!settings) return true;

  const bucket = getNotificationBucket(notification.type);
  if (bucket === 'matches' && !settings.receiveMatchAlerts) return false;
  if (bucket === 'system' && !settings.receiveSystemNotifications) return false;

  return true;
};
