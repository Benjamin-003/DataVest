import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../prisma/client';

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
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Vérifie que le header Authorization est présent et commence par "Bearer "
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  // Extrait le token du header (on retire "Bearer ")
  const token = authHeader.split(' ')[1];

   try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Récupère l'utilisateur complet depuis la base
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }     req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
    };
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