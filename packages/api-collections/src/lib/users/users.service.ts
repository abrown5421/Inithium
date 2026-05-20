import { createCrudService, CrudService } from '@inithium/api-core';
import type { User } from '@inithium/types';
import { UserModel } from './users.model.js';

export interface UsersService extends CrudService<User> {
  // Extend here with users-specific methods as needed
}

export const usersService: UsersService = {
  ...createCrudService<User>(UserModel),
};
