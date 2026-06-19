import type { Friend } from '@inithium/types';
import { createCrudService, CrudService } from '@inithium/api-core';
import { FriendModel } from './friends.model.js';

export interface FriendsService extends CrudService<Friend> {}

const base = createCrudService<Friend>(FriendModel);

export const friendsService: FriendsService = {
  ...base,

  createOne: async (data) => {
    const payload = {
      ...(data as Partial<Friend>),
      date_sent: new Date().toISOString(),
      status: 'pending' as const,
    };
    return base.createOne(payload);
  },

  updateOne: async (id, data) => {
    const raw = data as Partial<Friend>;
    const payload: Partial<Friend> = { ...raw };

    if (raw.status === 'accepted' && !raw.date_accepted) {
      payload.date_accepted = new Date().toISOString();
    }

    return base.updateOne(id, payload);
  },
};