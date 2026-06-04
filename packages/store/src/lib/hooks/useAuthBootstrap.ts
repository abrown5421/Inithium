import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import {
  setActiveUser,
  clearActiveUser,
  setBootstrappingComplete,
} from '../features/active-user/active-user-slice';
import { useRefreshMutation } from '../features/auth/auth-api';
import { AppDispatch } from '../../store';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const REFRESH_INTERVAL_MS = 14 * 60 * 1000;
const EXPIRY_THRESHOLD_MS = 60 * 1000;

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const origin = import.meta.env['VITE_API_ORIGIN'] || import.meta.env['VITE_PUBLIC_API_URL'];
    return origin ? `${origin}/api` : 'http://localhost:3000/api';
  }
  return 'http://localhost:3000/api';
};

const fetchUserById = async (id: string, token: string) => {
  const res = await fetch(`${getApiBaseUrl()}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
};

export const useAuthBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refresh] = useRefreshMutation();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const attemptRefresh = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      await refresh({ refreshToken }).unwrap();
      return true;
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      dispatch(clearActiveUser());
      return false;
    }
  };

  const bootstrapUser = async (token: string) => {
    try {
      const payload = jwtDecode<AccessTokenPayload>(token);
      const expiresInMs = payload.exp * 1000 - Date.now();

      if (expiresInMs < EXPIRY_THRESHOLD_MS) {
        const refreshed = await attemptRefresh();
        if (!refreshed) {
          dispatch(setBootstrappingComplete());
          return;
        }
        const newToken = localStorage.getItem('auth_token');
        if (!newToken) {
          dispatch(setBootstrappingComplete());
          return;
        }
        return bootstrapUser(newToken);
      }

      const user = await fetchUserById(payload.sub, token);
      dispatch(setActiveUser(user));

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(async () => {
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) {
          clearInterval(intervalRef.current!);
          return;
        }
        const currentPayload = jwtDecode<AccessTokenPayload>(currentToken);
        const timeLeft = currentPayload.exp * 1000 - Date.now();
        if (timeLeft < EXPIRY_THRESHOLD_MS) {
          await attemptRefresh();
        }
      }, REFRESH_INTERVAL_MS);

    } catch (e) {
      console.error('[useAuthBootstrap] failed:', e);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      dispatch(clearActiveUser());
      dispatch(setBootstrappingComplete());
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      bootstrapUser(token);
    } else {
      dispatch(setBootstrappingComplete());
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
};