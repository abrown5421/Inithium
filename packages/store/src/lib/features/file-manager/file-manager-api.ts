import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type CreatePageDto = {
  slug: string;
  componentName: string;
};

export type CreatePageResponseDto = {
  message: string;
  slug: string;
};

export type DeletePageResponseDto = {
  message: string;
  slug: string;
};

export const fileManagerApi = createApi({
  reducerPath: 'fileManagerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/file-manager' }),
  endpoints: (builder) => ({
    createPage: builder.mutation<CreatePageResponseDto, CreatePageDto>({
      query: (body) => ({
        url: '/pages',
        method: 'POST',
        body,
      }),
    }),

    deletePage: builder.mutation<DeletePageResponseDto, string>({
      query: (slug) => ({
        url: `/pages/${slug}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreatePageMutation,
  useDeletePageMutation,
} = fileManagerApi;