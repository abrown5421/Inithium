// packages/store/src/lib/base/base-api.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { clearActiveUser } from '../features/active-user/active-user-slice';

// Each app sets VITE_LOGIN_PATH in its own .env — defaults to /auth/login
const getLoginPath = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env['VITE_LOGIN_PATH'] ?? '/auth/login';
  }
  return '/auth/login';
};

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const origin = import.meta.env['API_ORIGIN'] || import.meta.env['VITE_PUBLIC_API_URL'];
    return origin ? `${origin}/api` : 'http://localhost:3000/api';
  }
  return 'http://localhost:3000/api';
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
          accessToken: string;
          refreshToken: string;
        };

        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        api.dispatch(clearActiveUser());
        window.location.href = getLoginPath(); // ← was hardcoded
      }
    } else {
      localStorage.removeItem('auth_token');
      api.dispatch(clearActiveUser());
      window.location.href = getLoginPath(); // ← was hardcoded
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'inithiumApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Page', 'Asset', 'Auth'],
  endpoints: () => ({}),
});