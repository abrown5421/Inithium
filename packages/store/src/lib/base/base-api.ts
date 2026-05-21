import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const origin = import.meta.env['API_ORIGIN'] || import.meta.env['VITE_PUBLIC_API_URL'];
    return origin ? `${origin}/api` : 'http://localhost:3000/api';
  }
  return 'http://localhost:3000/api';
};

export const baseApi = createApi({
  reducerPath: 'inithiumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Page', 'Asset', 'Auth'],
  endpoints: () => ({}),
});