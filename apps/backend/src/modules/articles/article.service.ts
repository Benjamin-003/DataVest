import { AppError } from '../../middleware/error.middleware';
import { RSS_FEEDS } from '../../config/rss-feeds';

export const articleService = {
  async getArticles(feedId: string): Promise<string> {
    const url = RSS_FEEDS[feedId];
    if (!url) {
      throw new AppError(400, 'Flux RSS inconnu');
    }

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error();

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('xml') && !contentType.includes('rss')) {
        throw new Error('Type de contenu inattendu');
      }

      return await response.text();
    } catch {
      throw new AppError(404, 'Flux RSS introuvable ou inaccessible');
    }
  },
};