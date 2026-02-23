import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { config } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';
import { LoginInput, RegisterInput, UpdateMeInput } from './auth.schema';

// Génère une paire de tokens (access + refresh) à partir des infos de l'utilisateur
// Le access token est de courte durée (7j), le refresh token de longue durée (30j)
const generateTokens = (payload: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

// Retire le mot de passe et le refreshToken avant de renvoyer l'utilisateur au client
// On ne veut jamais exposer ces données sensibles dans les réponses
const sanitizeUser = (user: {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: Date;
}) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt,
});

// Mise à jour partielle du profil
const updateUser = async (userId: string, data: UpdateMeInput) => {
  // Si un nouveau mot de passe est fourni, on le hash avant de sauvegarder
  const updateData = data.password
    ? { ...data, password: await bcrypt.hash(data.password, 12) }
    : data;

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
};

export const authService = {

  // Inscription : vérifie que l'email n'existe pas, hash le mot de passe, crée l'utilisateur
  async register(data: RegisterInput) {
    // Vérifie si un utilisateur avec cet email existe déjà
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, 'Email déjà utilisé');

    // Hash le mot de passe avec bcrypt (12 = niveau de complexité du hash)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Crée l'utilisateur en base avec le mot de passe hashé
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Génère les tokens et sauvegarde le refresh token en base
    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return { user: sanitizeUser(user), ...tokens };
  },

  // Connexion : vérifie l'email et le mot de passe, retourne les tokens
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    // Message générique volontaire : on ne dit pas si c'est l'email ou le mot de passe qui est faux
    if (!user) throw new AppError(401, 'Identifiants invalides');

    // Compare le mot de passe envoyé avec le hash en base
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError(401, 'Identifiants invalides');

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return { user: sanitizeUser(user), ...tokens };
  },

  // Renouvellement du token : vérifie le refresh token et retourne une nouvelle paire de tokens
  async refresh(refreshToken: string) {
    let payload: { id: string; email: string; role: string };
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as typeof payload;
    } catch {
      throw new AppError(401, 'Refresh token invalide');
    }

    // Vérifie que le refresh token en base correspond bien à celui envoyé
    // Cela permet d'invalider les anciens tokens après une déconnexion
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.refreshToken !== refreshToken) throw new AppError(401, 'Refresh token invalide');

    const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return tokens;
  },

  // Déconnexion : supprime le refresh token en base pour l'invalider
  async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  },

  // Récupère le profil de l'utilisateur connecté
  async getLoggedUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'Utilisateur non trouvé');
    return sanitizeUser(user);
  },async updateMe(userId: string, data: UpdateMeInput) {
  // Vérifie que le nouvel email n'est pas déjà utilisé par quelqu'un d'autre
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing && existing.id !== userId) throw new AppError(409, 'Email déjà utilisé');
  }

  const user = await updateUser(userId, data);
  return sanitizeUser(user);
},

async deleteMe(userId: string) {
  await deleteUser(userId);
},
};