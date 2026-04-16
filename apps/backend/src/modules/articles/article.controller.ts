import { Request, Response, NextFunction } from 'express';
import { articleService } from './article.service';

export const articleController = {
  // GET /api/articles/:url
  // :url est l'URL du flux RSS encodée en base64
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const xml = await articleService.getArticles(req.params.url);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  },
};
