import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export interface Page { _id: string; title: string; content: string; slug: string; }

export const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...createCrudEndpoints<Page, Omit<Page, '_id'>, Partial<Omit<Page, '_id'>>>('pages', 'Page')(builder),
  }),
  overrideExisting: false,
});

export const {
  useCreateOneMutation: useCreatePageMutation,
  useReadOneQuery: usePageQuery,
  useReadManyQuery: usePagesBatchMutation,
  useUpdateOneMutation: useUpdatePageMutation,
  useDeleteOneMutation: useDeletePageMutation,
  useDeleteManyMutation: useDeletePagesBatchMutation,
} = pagesApi;