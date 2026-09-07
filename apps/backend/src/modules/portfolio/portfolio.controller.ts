import { NextFunction, Request, Response } from 'express';
import { portfolioService } from './portfolio.service';

export const portfolioController = {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const positions = await portfolioService.findAll(req.user!.id);
      res.json(positions);
    } catch (e) { next(e); }
  },

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const position = await portfolioService.addPosition(req.user!.id, req.body);
      res.status(201).json(position);
    } catch (e) { next(e); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await portfolioService.removePosition(req.user!.id, req.params['id'] as string);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};