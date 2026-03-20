import { MatchItem, MatchResponse, Post } from '../types';

const MATCHING_API_BASE_URL =
  import.meta.env.VITE_MATCHING_API_BASE_URL || 'http://localhost:4002';

const getString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const getNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && !Number.isNaN(value) ? value : fallback;

const asObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

const normalizePost = (value: unknown): Post | undefined => {
  const post = asObject(value);
  if (!post) return undefined;

  const id = getString(post.id ?? post._id);
  if (!id) return undefined;

  const type = getString(post.type, 'LOST').toUpperCase() as Post['type'];
  const status = getString(post.status, 'OPEN').toUpperCase() as Post['status'];

  return {
    id,
    type: type === 'FOUND' ? 'FOUND' : 'LOST',
    category: getString(post.category ?? post.itemCategory ?? post.title, 'Uncategorized'),
    location: getString(post.location ?? post.foundLocation ?? post.lostLocation, 'Campus'),
    date: getString(post.date ?? post.createdAt ?? new Date().toISOString()),
    description: getString(post.description ?? post.details ?? 'No description provided.'),
    imageUrl: getString(post.imageUrl ?? post.image ?? post.imageURL),
    status: status === 'CLOSED' ? 'CLOSED' : 'OPEN',
    createdAt: getString(post.createdAt),
    updatedAt: getString(post.updatedAt),
  };
};

const normalizeSingleMatch = (value: unknown): MatchItem | null => {
  const item = asObject(value);
  if (!item) return null;

  const matchedPostId = getString(
    item.matchedPostId ??
      item.matchId ??
      item.postId ??
      item.id ??
      asObject(item.post)?.id,
  );

  if (!matchedPostId) return null;

  const reasons =
    Array.isArray(item.reasons) ? item.reasons.map((reason) => String(reason)) : [];

  return {
    matchedPostId,
    score: getNumber(item.score, 0),
    reasons,
    post: normalizePost(item.post ?? item.matchedPost),
  };
};

const normalizeMatchResponse = (value: unknown): MatchResponse => {
  const obj = asObject(value);

  const rawMatches =
    (Array.isArray(obj?.matches) && obj?.matches) ||
    (Array.isArray(obj?.data) && obj?.data) ||
    (Array.isArray(asObject(obj?.data)?.matches) && asObject(obj?.data)?.matches) ||
    [];

  const matches = rawMatches
    .map(normalizeSingleMatch)
    .filter((match): match is MatchItem => Boolean(match));

  const count =
    typeof obj?.count === 'number'
      ? obj.count
      : matches.length;

  return { count, matches };
};

export const matchingService = {
  async getMatchesForPost(post: Post): Promise<MatchResponse> {
    const response = await fetch(`${MATCHING_API_BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post }),
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload && 'message' in payload
          ? String(payload.message)
          : 'Unable to fetch matches.';
      throw new Error(message);
    }

    return normalizeMatchResponse(payload);
  },
};