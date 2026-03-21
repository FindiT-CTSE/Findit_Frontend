export type PostType = 'LOST' | 'FOUND';
export type PostStatus = 'OPEN' | 'CLOSED';

export interface User {
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PostOwner {
  id?: string;
  name?: string;
  email?: string;
}

export interface Post {
  id: string;
  type: PostType;
  category: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
  status: PostStatus;
  owner?: PostOwner;
  user?: PostOwner;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostPayload {
  type: PostType;
  category: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface PostFilters {
  type?: string;
  category?: string;
  location?: string;
  status?: string;
  search?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'MATCH' | 'SYSTEM' | 'REMINDER';
  createdAt: string;
  read?: boolean;
}

export interface DashboardStats {
  totalPosts: number;
  openPosts: number;
  closedPosts: number;
  possibleMatches: number;
}

export interface ProfileSettings {
  receiveMatchAlerts: boolean;
  receiveSystemNotifications: boolean;
  receiveEmailUpdates: boolean;
  showOnlyOpenPostsByDefault: boolean;
}

export interface MatchItem {
  matchedPostId: string;
  score: number;
  reasons: string[];
  post?: Post;
}

export interface MatchResponse {
  count: number;
  matches: MatchItem[];
}
