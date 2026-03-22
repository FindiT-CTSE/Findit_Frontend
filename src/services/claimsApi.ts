import { ClaimListResponse, ClaimResponse, SubmitClaimPayload } from '../types';

const CLAIMS_API_BASE_URL =
  import.meta.env.VITE_CLAIMS_API || 'http://localhost:4003';

let claimsAuthToken: string | null = null;

export const setClaimsAuthToken = (token: string | null) => {
  claimsAuthToken = token;
};

const buildHeaders = () => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (claimsAuthToken) {
    headers.set('Authorization', `Bearer ${claimsAuthToken}`);
  }

  return headers;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${CLAIMS_API_BASE_URL}${path}`, {
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
        : 'Unable to complete the claims request.';
    throw new Error(message);
  }

  return payload as T;
};

export const submitClaim = async (payload: SubmitClaimPayload) =>
  request<ClaimResponse>('/claims', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchMyClaims = async () =>
  request<ClaimListResponse>('/claims/mine', {
    method: 'GET',
    cache: 'no-store',
  });

export const fetchReceivedClaims = async () =>
  request<ClaimListResponse>('/claims/received', {
    method: 'GET',
    cache: 'no-store',
  });

export const fetchClaimById = async (id: string) =>
  request<ClaimResponse>(`/claims/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });

export const approveClaim = async (id: string) =>
  request<ClaimResponse>(`/claims/${id}/approve`, {
    method: 'PATCH',
  });

export const rejectClaim = async (id: string) =>
  request<ClaimResponse>(`/claims/${id}/reject`, {
    method: 'PATCH',
  });

export const cancelClaim = async (id: string) =>
  request<ClaimResponse>(`/claims/${id}/cancel`, {
    method: 'PATCH',
  });
