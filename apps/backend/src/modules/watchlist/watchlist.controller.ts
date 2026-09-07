import { NextFunction, Request, Response } from 'express';
import { watchlistService } from './watchlist.service';

export const watchlistController = {

  async getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await watchlistService.findAll(req.user!.id);
    res.json(items);
  } catch (e) { next(e); }
},

async add(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await watchlistService.addItem(req.user!.id, req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
},

async remove(req: Request, res: Response, next: NextFunction) {
  try {
    await watchlistService.removeItem(req.user!.id, req.params['id'] as string);
    res.status(204).send();
  } catch (e) { next(e); }
},
};