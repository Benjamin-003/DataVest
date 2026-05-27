import { Request, Response, NextFunction } from 'express';
import { articleService } from './article.service';
import { authService } from '../auth/auth.service';

export const articleController = {
  // GET /api/articles/:url
  // :url est l'URL du flux RSS encodée en base64
  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const url = Array.isArray(req.params.url) ? req.params.url[0] : req.params.url;
      const xml = await articleService.getArticles(url);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } catch (err) {
      next(err);
    }
  },
};
