import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { config } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { ChangePasswordInput, LoginInput, RegisterInput, UpdateMeInput } from './auth.schema';
import crypto from 'crypto';
import { authMailer } from './auth.mailer';

// --- Fonctions utilitaires (hors de l'objet) ---

const generateTokens = (payload: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

const generateSecureToken = () => crypto.randomBytes(32).toString('hex');

const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt,
});

const updateUser = async (userId: string, data: UpdateMeInput) => {
  const updateData = data.password
    ? { ...data, password: await bcrypt.hash(data.password, 12) }
    : data;

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

// --- Service Principal ---

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, 'Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return { user: sanitizeUser(user), ...tokens };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new AppError(401, 'Identifiants invalides');

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError(401, 'Identifiants invalides');

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return { user: sanitizeUser(user), ...tokens };
  },

  async refresh(refreshToken: string) {
    let payload: { id: string; email: string; role: string };
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as typeof payload;
    } catch {
      throw new AppError(401, 'Refresh token invalide');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.refreshToken !== refreshToken) throw new AppError(401, 'Refresh token invalide');

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return tokens;
  },

  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  },

  async getLoggedUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'Utilisateur non trouvé');
    return sanitizeUser(user);
  },

  async updateMe(userId: string, data: UpdateMeInput) {
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== userId) throw new AppError(409, 'Email déjà utilisé');
    }
    const user = await updateUser(userId, data);
    return sanitizeUser(user);
  },

  async deleteMe(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
  },

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'Utilisateur non trouvé');

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new AppError(401, 'Mot de passe actuel incorrect');

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = generateSecureToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    await authMailer.sendResetPasswordEmail(user.email, token, user.firstName || '');
  },

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) throw new AppError(400, 'Token invalide ou expiré');

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  },

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpires: { gt: new Date() },
      },
    });

    if (!user) throw new AppError(400, 'Token invalide ou expiré');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });
  },
};