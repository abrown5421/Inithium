import type { User } from '@inithium/types';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type CreateUserDto = Omit<User, '_id'>;
export type UpdateUserDto = Partial<CreateUserDto>;

const endpoints = createCrudEndpoints<User, CreateUserDto, UpdateUserDto>('users', 'User');

export const usersApi = baseApi.injectEndpoints({
  endpoints,
  overrideExisting: false,
});

const {
  useCreateUserMutation,
  useReadOneUserQuery:        useUserQuery,
  useLazyReadOneUserQuery:    useLazyUserQuery,
  useReadManyUserQuery:       useUsersBatchQuery,
  useUpdateOneUserMutation:   useUpdateUserMutation,
  useDeleteOneUserMutation:   useDeleteUserMutation,
  useDeleteManyUserMutation:  useDeleteUsersBatchMutation,
} = usersApi as any;

export {
  useCreateUserMutation,
  useUserQuery,
  useLazyUserQuery,
  useUsersBatchQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useDeleteUsersBatchMutation,
};