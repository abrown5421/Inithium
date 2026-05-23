import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';
import { Page } from '@inithium/types';

export type { Page };

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...createCrudEndpoints<Page, Omit<Page, '_id'>, Partial<Omit<Page, '_id'>>>(
      'pages',
      'Page',
    )(builder),

    readAllPages: builder.query<Page[], void>({
      query: () => '/pages',
      providesTags: ['Page'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Standard CRUD
  useCreateOneMutation:   useCreatePageMutation,
  useReadOneQuery:        usePageQuery,
  useReadManyQuery:       usePagesBatchQuery,
  useUpdateOneMutation:   useUpdatePageMutation,
  useDeleteOneMutation:   useDeletePageMutation,
  useDeleteManyMutation:  useDeletePagesBatchMutation,
  // Router-specific
  useReadAllPagesQuery,
} = pagesApi;