import { baseApi } from '../../base/base-api';
import { clearActiveUser } from '../active-user/active-user-slice';
import type { AuthTokens, LoginRequestDto, User } from '@inithium/types';

export type SignupDto = Omit<User, '_id'>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthTokens, SignupDto>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('auth_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
        } catch {}
      },
    }),

    login: builder.mutation<AuthTokens, LoginRequestDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('auth_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
        } catch {}
      },
    }),

    refresh: builder.mutation<AuthTokens, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('auth_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          dispatch(clearActiveUser());
          window.location.href = '/auth/login';
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          dispatch(clearActiveUser());
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;