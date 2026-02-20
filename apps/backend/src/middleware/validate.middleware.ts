import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

// Middleware factory : il prend un schéma Zod en paramètre et retourne un middleware Express
// On l'utilise sur les routes pour valider les données avant qu'elles atteignent le contrôleur
// Exemple d'utilisation sur une route : router.post('/register', validate(registerSchema), authController.register)
export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // On valide le body, les query params et les params d'URL en même temps
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Si tout est valide, on passe au middleware/contrôleur suivant
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Si Zod détecte des erreurs, on retourne un 422 avec le détail des champs invalides
        // Ex: { field: "email", message: "Invalid email address" }
        res.status(422).json({
          message: 'Validation error',
          errors: error.issues.map((e) => ({
            field: e.path.slice(1).join('.'), // on retire le premier élément (body/query/params)
            message: e.message,
          })),
        });
      } else {
        // Si c'est une autre erreur inattendue, on la passe au error.middleware.ts
        next(error);
      }
    }
  };