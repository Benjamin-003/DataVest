import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import { config } from "../../config/env";
import { AppError } from "../../middleware/error.middleware";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  UpdateMeInput,
} from "./auth.schema";
import crypto from "node:crypto";
import { authMailer } from "./auth.mailer";

// --- Fonctions utilitaires (hors de l'objet) ---

const generateTokens = (payload: {
  id: string;
  email: string;
  role: string;
}) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

const generateSecureToken = () => crypto.randomBytes(32).toString("hex");

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

// Vérifie que l'email n'est pas déjà utilisé
const checkEmailAvailability = async (email: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "Email déjà utilisé");
};

// Hash le mot de passe
const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

// Crée l'utilisateur en base
const createUser = async (data: RegisterInput, hashedPassword: string) => {
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
};

// Sauvegarde le refresh token en base
const saveRefreshToken = async (userId: string, refreshToken: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

// --- Service Principal ---

export const authService = {
  async register(data: RegisterInput) {
    await checkEmailAvailability(data.email);
    const hashedPassword = await hashPassword(data.password);
    const user = await createUser(data, hashedPassword);
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await saveRefreshToken(user.id, tokens.refreshToken);

    // Génère et sauvegarde le token de vérification email (valide 24h)
    const emailVerifyToken = generateSecureToken();
    const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken, emailVerifyExpires },
    });

    await authMailer.sendVerifyEmail(
      user.email,
      emailVerifyToken,
      user.firstName,
    );

    return { user: sanitizeUser(user), ...tokens };
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new AppError(401, "Identifiants invalides");

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError(401, "Identifiants invalides");

    // Génération et envoi du code 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: code,
        twoFactorExpires: expires,
      },
    });

    await authMailer.sendTwoFactorCode(user.email, code, user.firstName);

    // On indique au frontend que la 2FA est requise
    return { twoFactorRequired: true };
  },

  async refresh(refreshToken: string) {
    let payload: { id: string; email: string; role: string };
    try {
      payload = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret,
      ) as typeof payload;
    } catch {
      throw new AppError(401, "Refresh token invalide");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user?.refreshToken !== refreshToken)
      throw new AppError(401, "Refresh token invalide");

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  },

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  async getLoggedUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, "Utilisateur non trouvé");
    return sanitizeUser(user);
  },

  async updateMe(userId: string, data: UpdateMeInput) {
    if (data.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== userId)
        throw new AppError(409, "Email déjà utilisé");
    }
    const user = await updateUser(userId, data);
    return sanitizeUser(user);
  },

  async deleteMe(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
  },

  async checkEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  },

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, "Utilisateur non trouvé");

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new AppError(401, "Mot de passe actuel incorrect");

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // On ne révèle pas si l'email existe ou non pour des raisons de sécurité
    if (!user) return;

    const token = generateSecureToken();
    // Token valide 1 heure
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    await authMailer.sendResetPasswordEmail(user.email, token, user.firstName);
  },

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        // Vérifie que le token n'est pas expiré
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) throw new AppError(400, "Token invalide ou expiré");

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // On supprime le token après utilisation
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

    if (!user) throw new AppError(400, "Token invalide ou expiré");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });
  },
  async verifyTwoFactor(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(401, "Code invalide");

    // Vérifie que le code est correct et non expiré
    if (
      user.twoFactorCode !== code ||
      !user.twoFactorExpires ||
      user.twoFactorExpires < new Date()
    ) {
      throw new AppError(401, "Code invalide ou expiré");
    }

    // Supprime le code après utilisation
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorExpires: null,
      },
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user: sanitizeUser(user), ...tokens };
  },

  async enableTwoFactor(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
  },

  async disableTwoFactor(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorExpires: null,
      },
    });
  },
};
