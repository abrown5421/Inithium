import { Router, Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { authService } from './auth.service.js';
import { LoginSchema, SignupSchema, RefreshSchema } from './auth.validators.js';

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);

export const authRouter: Router = Router();

authRouter.post(
  '/signup',
  validate(SignupSchema),
  asyncHandler(async (req, res) => {
    const tokens = await authService.signup(req.body);
    res.status(201).json(tokens);
  })
);

authRouter.post(
  '/login',
  validate(LoginSchema),
  asyncHandler(async (req, res) => {
    const tokens = await authService.login(req.body);
    res.status(200).json(tokens);
  })
);

authRouter.post(
  '/refresh',
  validate(RefreshSchema),
  asyncHandler(async (req, res) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.status(200).json(tokens);
  })
);

authRouter.post('/logout', (_req, res) => {
  res.status(200).json({ message: 'Logged out' });
});