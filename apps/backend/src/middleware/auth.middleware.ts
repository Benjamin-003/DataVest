import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Interface qui décrit le contenu du token JWT une fois décodé
interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

type Role = 'USER' | 'ADMIN';

// Middleware qui vérifie si l'utilisateur est connecté
// Il lit le token dans le header Authorization et le vérifie
// Si le token est valide, il ajoute les infos de l'utilisateur dans req.user
// Exemple d'utilisation sur une route : router.get('/me', authenticate, authController.getMe)
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Vérifie que le header Authorization est présent et commence par "Bearer "
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  // Extrait le token du header (on retire "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Vérifie et décode le token avec notre secret
    // Si le token est expiré ou invalide, jwt.verify lance une erreur
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Injecte les infos de l'utilisateur dans la requête pour les utiliser dans le contrôleur
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Middleware qui vérifie si l'utilisateur a le bon rôle
// S'utilise toujours APRÈS authenticate
// Exemple : router.delete('/users', authenticate, authorize('ADMIN'), userController.delete)
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};