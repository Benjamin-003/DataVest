import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export const currencyController = {
  // GET /api/currencies
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const currencies = await prisma.currency.findMany({
        orderBy: { code: 'asc' },
      });
      res.status(200).json(currencies);
    } catch (err) {
      next(err);
    }
  },
};
