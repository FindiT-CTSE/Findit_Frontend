const TOKEN_KEY = 'findit_token';
const USER_KEY = 'findit_user';
const PROFILE_SETTINGS_KEY = 'findit_profile_settings';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: <T>() => {
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as T) : null;
  },
  setUser: (user: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  getProfileSettings: <T>() => {
    const value = localStorage.getItem(PROFILE_SETTINGS_KEY);
    return value ? (JSON.parse(value) as T) : null;
  },
  setProfileSettings: (settings: unknown) =>
    localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(settings)),
  clearProfileSettings: () => localStorage.removeItem(PROFILE_SETTINGS_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_SETTINGS_KEY);
  },
};
