import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';

export const languageController = {
  // GET /api/languages
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await prisma.language.findMany({
        orderBy: { code: 'asc' },
      });
      res.status(200).json(languages);
    } catch (err) {
      next(err);
    }
  },
};
