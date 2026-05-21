import { z } from 'zod';

export const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const SignupSchema = z.object({
  email:        z.string().email(),
  password:     z.string().min(8),
  first_name:   z.string().min(1),
  last_name:    z.string().min(1),
  role:         z.enum(['super-admin', 'admin', 'editor', 'writer', 'user']).default('user'),
  user_banner:  z.any().optional(),
  user_avatar:  z.any().optional(),
  bio:          z.string().optional(),
  gender:       z.any().optional(),
  phone_number: z.string().optional(),
  dob:          z.string().optional(),
  address:      z.any().optional(),
  dark_mode:    z.boolean().default(false),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type LoginDto    = z.infer<typeof LoginSchema>;
export type SignupDto   = z.infer<typeof SignupSchema>;
export type RefreshDto  = z.infer<typeof RefreshSchema>;