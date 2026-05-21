import bcrypt from 'bcryptjs';
import { UserModel } from '../users/users.model.js';
import { signTokens, verifyRefreshToken } from '@inithium/api-core';
import type { AuthTokens, LoginRequestDto } from '@inithium/types';
import type { SignupDto } from './auth.validators.js';

const SALT_ROUNDS = 12;

export const authService = {

  async signup(dto: SignupDto): Promise<AuthTokens> {
    const existing = await UserModel.findOne({ email: dto.email }).lean().exec();
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const created = await UserModel.create([{ ...dto, password: hashed }]);
    const user = created[0].toObject();

    return signTokens({
      sub:   user._id.toString(),
      email: user.email,
      role:  user.role,
    });
  },

  async login(dto: LoginRequestDto): Promise<AuthTokens> {
    const user = await UserModel.findOne({ email: dto.email }).lean().exec();
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    return signTokens({
      sub:   user._id.toString(),
      email: user.email,
      role:  user.role,
    });
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(payload.sub).lean().exec();
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 401 });
    }
    
    return signTokens({
      sub:   user._id.toString(),
      email: user.email,
      role:  user.role,
    });
  },

};