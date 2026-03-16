import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';
import { apiRequest } from './api';

export const authService = {
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProfile: () =>
    apiRequest<User>('/auth/me', {
      method: 'GET',
      auth: true,
    }),
};
