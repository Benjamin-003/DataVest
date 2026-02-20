import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

// The controller links routes to the service
// It receives the HTTP request, calls the service and sends the response
// It contains no business logic, only req/res handling
export const authController = {

  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      // 201 = Created
      res.status(201).json(result);
    } catch (err) {
      // Pass the error to error.middleware.ts
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await authService.refresh(req.body.refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout — protected route (requires authenticate)
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is injected by auth.middleware.ts
      await authService.logout(req.user!.id);
      // 204 = No Content
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me — protected route (requires authenticate)
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
};