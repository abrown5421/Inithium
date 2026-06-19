import { Router } from 'express';
import { createCrudRouter } from '@inithium/api-core';
import { friendsService } from './friends.service.js';
import { CreateFriendSchema, UpdateFriendSchema } from './friends.validators.js';

export const friendsRouter: Router = createCrudRouter(friendsService, {
  onCreate: CreateFriendSchema,
  onUpdate: UpdateFriendSchema,
});