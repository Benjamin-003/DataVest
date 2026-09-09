import { Request, Response, NextFunction } from 'express';
import { articleService } from './article.service';
import { authService } from '../auth/auth.service';

export const articleController = {
  // GET /api/articles/:feedId
  // :feedId est l'identifiant d'un flux RSS whitelisté (voir rss-feeds.ts)
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const feedId = Array.isArray(req.params.feedId) ? req.params.feedId[0] : req.params.feedId;
      const xml = await articleService.getArticles(feedId);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  },
};
