import bcrypt from 'bcryptjs';
import type { User } from '@inithium/types';
import { UserModel } from './users.model.js';
import { createCrudService, CrudService } from '@inithium/api-core';

export interface UsersService extends CrudService<User> {}

const base = createCrudService<User>(UserModel);

export const usersService: UsersService = {
  ...base,

  createOne: async (data) => {
    const d = data as Partial<User>;
    if (d.password) {
      d.password = await bcrypt.hash(d.password, 12);
    }
    return base.createOne(d);
  },
};