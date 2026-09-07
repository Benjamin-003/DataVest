import { AppError } from '../../middleware/error.middleware';

export const articleService = {
  // Récupère le contenu brut d'un flux RSS via son URL (encodée en base64)
  async getArticles(encodedUrl: string): Promise<string> {
    let url: string;

    try {
      // L'URL est encodée en base64 pour éviter les conflits avec les slashes dans l'URL de la route
      url = Buffer.from(encodedUrl, 'base64').toString('utf-8');
    } catch {
      throw new AppError(400, 'URL invalide');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      return await response.text();
    } catch {
      throw new AppError(404, 'Flux RSS introuvable ou inaccessible');
    }
  },
};
