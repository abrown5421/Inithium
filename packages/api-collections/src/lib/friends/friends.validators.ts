import { z } from 'zod';
import type { Friend } from '@inithium/types';

export const CreateFriendSchema = z.object({
  requester:    z.string().min(1),
  recipient:    z.string().min(1),
  status:       z.enum(['pending', 'accepted', 'declined']).default('pending'),
  action_user:  z.string().min(1),
  date_sent:    z.string().datetime(),
  date_accepted:z.string().datetime().optional(),
}) satisfies z.ZodType<Omit<Friend, '_id' | 'requester' | 'recipient'> & { requester: string; recipient: string }>;

export const UpdateFriendSchema = CreateFriendSchema.partial();

export type CreateFriendDto = z.infer<typeof CreateFriendSchema>;
export type UpdateFriendDto = z.infer<typeof UpdateFriendSchema>;