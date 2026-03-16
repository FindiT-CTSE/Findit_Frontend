import { CreatePostPayload, Post, PostFilters } from '../types';
import { apiRequest } from './api';

const toQueryString = (filters: PostFilters) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const result = query.toString();
  return result ? `?${result}` : '';
};

export const postService = {
  async getPosts(filters: PostFilters = {}) {
    const response = await apiRequest<unknown>(`/posts${toQueryString(filters)}`, {
      method: 'GET',
    });
    return normalizePostCollection(response);
  },
  async getPostById(id: string) {
    const response = await apiRequest<unknown>(`/posts/${id}`, {
      method: 'GET',
    });
    return normalizeSinglePost(response);
  },
  async createPost(payload: CreatePostPayload) {
    const response = await apiRequest<unknown>('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
      auth: true,
    });
    return normalizeSinglePost(response);
  },
  async closePost(id: string) {
    const response = await apiRequest<unknown>(`/posts/${id}/close`, {
      method: 'PATCH',
      auth: true,
    });
    return normalizeSinglePost(response);
  },
  deletePost: (id: string) =>
    apiRequest<void>(`/posts/${id}`, {
      method: 'DELETE',
      auth: true,
    }),
};

const asObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

const getNestedObject = (value: unknown, keys: string[]) => {
  const object = asObject(value);
  if (!object) return null;

  for (const key of keys) {
    const nested = asObject(object[key]);
    if (nested) return nested;
  }

  return null;
};

const getString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const extractOwner = (post: Record<string, unknown>) => {
  const owner =
    getNestedObject(post, ['owner', 'user', 'userId', 'postedBy', 'createdBy']) ||
    getNestedObject(post, ['ownerId']);

  if (!owner) return undefined;

  return {
    id: getString(owner.id ?? owner._id),
    name: getString(owner.name ?? owner.fullName ?? owner.username),
    email: getString(owner.email),
  };
};

const normalizePost = (value: unknown): Post | null => {
  const post = asObject(value);
  if (!post) return null;

  const id = getString(post.id ?? post._id);
  if (!id) return null;

  const owner = extractOwner(post);
  const type = getString(post.type, 'LOST').toUpperCase() as Post['type'];
  const status = getString(post.status, 'OPEN').toUpperCase() as Post['status'];

  return {
    id,
    type: type === 'FOUND' ? 'FOUND' : 'LOST',
    category: getString(post.category ?? post.itemCategory ?? post.title, 'Uncategorized'),
    location: getString(post.location ?? post.foundLocation ?? post.lostLocation, 'Campus'),
    date: getString(post.date ?? post.createdAt ?? post.updatedAt, new Date().toISOString()),
    description: getString(post.description ?? post.details ?? post.note, 'No description provided.'),
    imageUrl: getString(post.imageUrl ?? post.image ?? post.imageURL),
    status: status === 'CLOSED' ? 'CLOSED' : 'OPEN',
    owner,
    user: owner,
    createdAt: getString(post.createdAt ?? post.date),
    updatedAt: getString(post.updatedAt),
  };
};

const normalizePostCollection = (value: unknown): Post[] => {
  if (Array.isArray(value)) {
    return value.map(normalizePost).filter((post): post is Post => Boolean(post));
  }

  const object = asObject(value);
  if (!object) return [];

  const candidates = [
    object.posts,
    object.items,
    object.results,
    object.data,
    asObject(object.data)?.posts,
    asObject(object.data)?.items,
    asObject(object.data)?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map(normalizePost).filter((post): post is Post => Boolean(post));
    }
  }

  const single = normalizePost(object);
  return single ? [single] : [];
};

const normalizeSinglePost = (value: unknown): Post => {
  const object = asObject(value);
  const candidate =
    object?.post ??
    object?.data ??
    asObject(object?.data)?.post ??
    value;

  const normalized = normalizePost(candidate);
  if (!normalized) {
    throw new Error('The backend returned a post in an unsupported format.');
  }

  return normalized;
};
