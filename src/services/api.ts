import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const buildHeaders = (headers?: HeadersInit, auth?: boolean) => {
  const baseHeaders = new Headers(headers);
  baseHeaders.set('Content-Type', 'application/json');
  if (auth) {
    const token = storage.getToken();
    if (token) {
      baseHeaders.set('Authorization', `Bearer ${token}`);
    }
  }
  return baseHeaders;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers, options.auth),
  });

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message)
        : 'Something went wrong. Please try again.';
    throw new ApiError(message, response.status);
  }

  return payload as T;
};
