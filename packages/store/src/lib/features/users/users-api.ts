import type { User } from '@inithium/types';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type CreateUserDto = Omit<User, '_id'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...createCrudEndpoints<User, CreateUserDto, UpdateUserDto>('users', 'User')(builder),
  }),
  overrideExisting: false,
});

export const {
  useCreateOneMutation: useCreateUserMutation,
  useReadOneQuery: useUserQuery,
  useReadManyQuery: useUsersBatchQuery,
  useUpdateOneMutation: useUpdateUserMutation,
  useDeleteOneMutation: useDeleteUserMutation,
  useDeleteManyMutation: useDeleteUsersBatchMutation,
} = usersApi;