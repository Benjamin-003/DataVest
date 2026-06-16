import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { prisma } from '../../prisma/client';
import { authMailer } from './auth.mailer';
import * as bcrypt from 'bcrypt';
import * as nodeCrypto from 'crypto';

// The controller links routes to the service
// It receives the HTTP request, calls the service and sends the response
// It contains no business logic, only req/res handling
export const authController = {

  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      // 201 = Created
      res.status(201).json(result);
    } catch (err) {
      // Pass the error to error.middleware.ts
      next(err);
    }
  },

  // POST /api/auth/login
 async login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }

  // ✅ Vérifier si l'email est validé
  if (!user.emailVerified) {
    return res.status(200).json({
      emailNotVerified: true,
      message: 'Veuillez valider votre email pour continuer',
    });
  }

  // Générer code 2FA et envoyer par email
  const twoFactorCode = Math.random().toString().slice(2, 8);
  const twoFactorExpires = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorCode, twoFactorExpires },
  });

 await authMailer.sendTwoFactorCode(user.email, twoFactorCode, user.firstName || '');

  return res.json({ twoFactorRequired: true });
},

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const tokens = await authService.refresh(req.body.refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout — protected route (requires authenticate)
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is injected by auth.middleware.ts
      await authService.logout(req.user!.id);
      // 204 = No Content
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
  

  // GET /api/auth/me — protected route (requires authenticate)
  async getLoggedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getLoggedUser(req.user!.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/auth/me — route protégée
async updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.updateMe(req.user!.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
},

// DELETE /api/auth/me — route protégée
async deleteMe(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.deleteMe(req.user!.id);
    // 204 = No Content
    res.status(204).send();
  } catch (err) {
    next(err);
  }
},

async checkEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.checkEmail(req.body.email);
    if (user) {
      // 200 = email trouvé en base
      res.status(200).json({ available: false });
    } else {
      // 404 = email absent = disponible
      res.status(404).json({ available: true });
    }
  } catch (err) {
    next(err);
  }
},
async changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.changePassword(req.user!.id, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
},
// POST /api/auth/forgot-password
async forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword(req.body.email);
    // On retourne toujours 200 même si l'email n'existe pas
    // pour ne pas révéler si un compte existe
    res.status(200).json({ message: 'If this email exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
},

// POST /api/auth/reset-password
async resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
},

// POST /api/auth/verify-email
async verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
},

async verifyTwoFactor(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.verifyTwoFactor(req.body.email, req.body.code);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
},

async enableTwoFactor(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.enableTwoFactor(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
},

async disableTwoFactor(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.disableTwoFactor(req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
},
  async exportMe(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.exportMe(req.user!.id);
    res.setHeader('Content-Disposition', 'attachment; filename="mes-donnees-ottawa-pigeon.json"');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
},
async resendVerificationEmail(req: Request, res: Response) {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: 'Votre email est déjà vérifié' });
  }

  // Générer un nouveau token de vérification (24h)
  const emailVerifyToken = nodeCrypto.randomBytes(32).toString('hex');
  const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken, emailVerifyExpires },
  });

  // Envoyer le mail
  const verifyLink = `${process.env.FRONTEND_URL}/authentication/verify-email?token=${emailVerifyToken}`;
 await authMailer.sendVerifyEmail(user.email, emailVerifyToken, user.firstName || '');

  return res.json({ message: 'Un nouveau mail de vérification a été envoyé' });
},
};

