import { NextFunction, Request, Response } from 'express';
import { priceHistoryService, Range } from './price-history.service';

const VALID_RANGES: Range[] = ['1d', '5d', '1mo', '1y'];

export const priceHistoryController = {

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const symbol = (req.params['symbol'] as string).toUpperCase();
      const range  = (req.query['range'] as Range) ?? '1mo';

      if (!VALID_RANGES.includes(range)) {
        res.status(400).json({ message: `Range invalide. Valeurs acceptées : ${VALID_RANGES.join(', ')}` });
        return;
      }

      const data = await priceHistoryService.getHistory(symbol, range);
      res.json(data);
    } catch (e) { next(e); }
  },
};