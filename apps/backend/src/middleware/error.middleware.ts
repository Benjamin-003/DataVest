import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Classe personnalisée pour les erreurs métier de l'application
// On l'utilise pour créer des erreurs avec un code HTTP spécifique
// Exemple d'utilisation : throw new AppError(404, 'Utilisateur non trouvé')
export class AppError extends Error {
  constructor(
    public statusCode: number, // Le code HTTP à retourner (404, 401, 409...)
    public message: string,    // Le message d'erreur lisible
    public isOperational = true, // Distingue les erreurs métier des bugs inattendus
  ) {
    super(message);
    // Nécessaire pour que "instanceof AppError" fonctionne correctement en TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Middleware de gestion globale des erreurs Express
// Il doit toujours être déclaré EN DERNIER dans app.ts
// Express le reconnaît comme gestionnaire d'erreurs grâce aux 4 paramètres (err, req, res, next)
export const errorHandler = (
  err: Error,
  _req: Request,   // Le _ indique qu'on n'utilise pas ce paramètre
  res: Response,
  _next: NextFunction,
): void => {

  // Cas 1 : erreur de validation Zod (données invalides envoyées par le client)
  // On retourne un 422 avec le détail de chaque champ invalide
if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Validation error',
      errors: err.issues.map((e) => ({ 
        field: e.path.map(String).join('.'), 
        message: e.message 
      })),
    });
    return;
  }
  // Cas 2 : erreur métier volontaire (throw new AppError(...))
  // On retourne le code HTTP et le message définis lors du throw
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Cas 3 : erreur inattendue (bug, crash...)
  // On log l'erreur côté serveur et on retourne un 500 générique au client
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal server error' });
};