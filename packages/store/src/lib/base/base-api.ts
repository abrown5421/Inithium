import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'inithiumApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env['NX_PUBLIC_API_URL'] ?? 'http://localhost:3000/api',
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