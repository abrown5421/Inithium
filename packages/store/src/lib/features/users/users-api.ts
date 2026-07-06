import type { User } from '@inithium/types';
import type { PaginatedResult, PaginationQuery } from '@inithium/api-core';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type CreateUserDto = Omit<User, '_id'>;
export type UpdateUserDto = Partial<CreateUserDto>;

const endpoints = createCrudEndpoints<User, CreateUserDto, UpdateUserDto>('users', 'User');

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...endpoints(builder),
    readAllUsers: builder.query<PaginatedResult<User>, PaginationQuery | void>({
      query: (params) => ({ url: '/users', params: params ?? {} }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

const {
  useCreateUserMutation,
  useReadOneUserQuery:        useUserQuery,
  useLazyReadOneUserQuery:    useLazyUserQuery,
  useReadManyUserQuery:       useUsersBatchQuery,
  useReadPageUserQuery:       useUsersPageQuery,
  useUpdateOneUserMutation:   useUpdateUserMutation,
  useDeleteOneUserMutation:   useDeleteUserMutation,
  useDeleteManyUserMutation:  useDeleteUsersBatchMutation,
  useReadAllUsersQuery,
} = usersApi as any;

export {
  useCreateUserMutation,
  useUserQuery,
  useLazyUserQuery,
  useUsersBatchQuery,
  useUsersPageQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteUsersBatchMutation,
  useReadAllUsersQuery,
};