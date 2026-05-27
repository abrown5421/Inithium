import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setActiveUser, clearActiveUser, setBootstrappingComplete } from '../features/active-user/active-user-slice';
import { useRefreshMutation } from '../features/auth/auth-api';
import { AppDispatch } from '../../store';
import { useLazyUserQuery } from '../features/users/users-api';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const REFRESH_INTERVAL_MS = 14 * 60 * 1000;
const EXPIRY_THRESHOLD_MS = 60 * 1000;

export const useAuthBootstrap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refresh] = useRefreshMutation();
  const [fetchUser] = useLazyUserQuery();
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
      window.location.href = '/auth/login';
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

      const user = await fetchUser(payload.sub).unwrap();
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

    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      dispatch(clearActiveUser());
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