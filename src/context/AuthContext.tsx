import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeAuth = (response: AuthResponse) => {
  storage.setToken(response.token);
  storage.setUser(response.user);
  return response;
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

const AuthState = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(false);

  const applyAuth = useCallback((response: AuthResponse) => {
    const normalized = normalizeAuth(response);
    setUser(normalized.user);
    setToken(normalized.token);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      applyAuth(response);
    } finally {
      setIsLoading(false);
    }
  }, [applyAuth]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      applyAuth(response);
    } finally {
      setIsLoading(false);
    }
  }, [applyAuth]);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
    redirectToLogin();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!storage.getToken()) return;
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      storage.setUser(profile);
    } catch {
      // Auth listener handles unauthorized state.
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((current) => {
      if (!current) return current;
      const nextUser = { ...current, ...updates };
      storage.setUser(nextUser);
      return nextUser;
    });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      storage.clearAuth();
      setUser(null);
      setToken(null);
      redirectToLogin();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
    }),
    [user, token, isLoading, login, register, logout, refreshProfile, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthState>{children}</AuthState>
);
