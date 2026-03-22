import { storage } from '../utils/storage';
import { CORE_API_BASE_URL } from './gateway';

const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);

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
  let response: Response;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    response = await fetch(`${CORE_API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: buildHeaders(options.headers, options.auth),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        `The request to ${CORE_API_BASE_URL}${path} took too long. Check whether the API Gateway is running and responding.`,
        408,
      );
    }

    throw new ApiError(
      `Unable to connect to the server at ${CORE_API_BASE_URL}. Make sure the API Gateway is running and reachable.`,
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

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
