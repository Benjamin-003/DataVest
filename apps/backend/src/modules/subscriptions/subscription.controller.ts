import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export const subscriptionController = {
  // GET /api/subscriptions
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        orderBy: { code: 'asc' },
      });
      res.status(200).json(subscriptions);
    } catch (err) {
      next(err);
    }
  },
};
