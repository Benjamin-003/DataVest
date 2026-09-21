import { vi, describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';
import { prisma } from '../../prisma/client';
import { authMailer } from './auth.mailer';

vi.mock('../../prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock('./auth.mailer', () => ({
  authMailer: {
    sendVerifyEmail: vi.fn().mockResolvedValue(undefined),
    sendTwoFactorCode: vi.fn().mockResolvedValue(undefined),
    sendResetPasswordEmail: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../config/env', () => ({
  config: {
    jwt: {
      secret: 'test-secret',
      refreshSecret: 'test-refresh-secret',
      expiresIn: '15m',
      refreshExpiresIn: '7d',
    },
  },
}));

const findUnique = vi.mocked(prisma.user.findUnique);
const findFirst = vi.mocked(prisma.user.findFirst);
const create = vi.mocked(prisma.user.create);
const update = vi.mocked(prisma.user.update);
const compare = vi.mocked(bcrypt.compare) as any;
const hash = vi.mocked(bcrypt.hash) as any;

const baseUser = {
  id: 'user-123',
  email: 'test@test.com',
  firstName: 'Test',
  role: 'USER',
  password: 'hashed_password',
};

const del = vi.mocked(prisma.user.delete);

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should fail if email is already taken', async () => {
      (findUnique as any).mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({ email: 'qsd@qsd.com', password: 'MonMotDePasse123!' } as any),
      ).rejects.toThrow('Email déjà utilisé');
    });

    it('should create the user, send the verification email and return tokens', async () => {
      (findUnique as any).mockResolvedValue(null);
      hash.mockResolvedValue('hashed');
      (create as any).mockResolvedValue(baseUser);
      (update as any).mockResolvedValue(baseUser);

      const result = await authService.register({
        email: baseUser.email,
        password: 'MonMotDePasse123!',
      } as any);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).not.toHaveProperty('password');
      expect(authMailer.sendVerifyEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should reject login for an unknown email', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'x@x.com', password: 'pwd' } as any),
      ).rejects.toThrow('Identifiants invalides');
    });

    it('should reject a wrong password', async () => {
      (findUnique as any).mockResolvedValue(baseUser);
      compare.mockResolvedValue(false);

      await expect(
        authService.login({ email: baseUser.email, password: 'bad' } as any),
      ).rejects.toThrow('Identifiants invalides');
    });

    it('should return twoFactorRequired and store a 6-digit code', async () => {
      (findUnique as any).mockResolvedValue(baseUser);
      compare.mockResolvedValue(true);

      const result = await authService.login({
        email: baseUser.email,
        password: 'MonMotDePasse123!',
      } as any);

      expect(result).toEqual({ twoFactorRequired: true });

      const call = (update as any).mock.calls[0][0];
      expect(call.data.twoFactorCode).toMatch(/^\d{6}$/);
      expect(call.data.twoFactorExpires.getTime()).toBeGreaterThan(Date.now());
      expect(authMailer.sendTwoFactorCode).toHaveBeenCalledWith(
        baseUser.email,
        call.data.twoFactorCode,
        baseUser.firstName,
      );
    });
  });

  describe('refresh', () => {
    it('should reject an invalid refresh token', async () => {
      await expect(authService.refresh('not-a-jwt')).rejects.toThrow('Refresh token invalide');
    });

    it('should reject a token that does not match the stored one', async () => {
      const token = jwt.sign(
        { id: baseUser.id, email: baseUser.email, role: baseUser.role },
        'test-refresh-secret',
      );
      (findUnique as any).mockResolvedValue({ ...baseUser, refreshToken: 'another-token' });

      await expect(authService.refresh(token)).rejects.toThrow('Refresh token invalide');
    });

    it('should issue new tokens when the refresh token is valid', async () => {
      const token = jwt.sign(
        { id: baseUser.id, email: baseUser.email, role: baseUser.role },
        'test-refresh-secret',
      );
      (findUnique as any).mockResolvedValue({ ...baseUser, refreshToken: token });
      (update as any).mockResolvedValue(baseUser);

      const tokens = await authService.refresh(token);

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });

      it('should reject a valid token whose user no longer exists', async () => {
      const token = jwt.sign(
        { id: baseUser.id, email: baseUser.email, role: baseUser.role },
        'test-refresh-secret',
      );
      (findUnique as any).mockResolvedValue(null);

      await expect(authService.refresh(token)).rejects.toThrow('Refresh token invalide');
    });

  });

  describe('verifyTwoFactor', () => {
    it('should reject a two-factor code for an unknown email', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(authService.verifyTwoFactor('x@x.com', '123456')).rejects.toThrow('Code invalide');
    });

    it('should reject a wrong code', async () => {
      (findUnique as any).mockResolvedValue({
        ...baseUser,
        twoFactorCode: '111111',
        twoFactorExpires: new Date(Date.now() + 60_000),
      });

      await expect(authService.verifyTwoFactor(baseUser.email, '222222')).rejects.toThrow(
        'Code invalide ou expiré',
      );
    });

    it('should reject an expired code', async () => {
      (findUnique as any).mockResolvedValue({
        ...baseUser,
        twoFactorCode: '111111',
        twoFactorExpires: new Date(Date.now() - 60_000),
      });

      await expect(authService.verifyTwoFactor(baseUser.email, '111111')).rejects.toThrow(
        'Code invalide ou expiré',
      );
    });

    it('should return tokens and clear the code when it is valid', async () => {
      (findUnique as any).mockResolvedValue({
        ...baseUser,
        twoFactorCode: '111111',
        twoFactorExpires: new Date(Date.now() + 60_000),
      });
      (update as any).mockResolvedValue(baseUser);

      const result = await authService.verifyTwoFactor(baseUser.email, '111111');

      expect(result.accessToken).toBeDefined();
      expect(result.user).not.toHaveProperty('password');
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { twoFactorCode: null, twoFactorExpires: null } }),
      );
    });
  });

  describe('forgotPassword', () => {
    it('should silently return when the email does not exist', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(authService.forgotPassword('x@x.com')).resolves.toBeUndefined();
      expect(authMailer.sendResetPasswordEmail).not.toHaveBeenCalled();
    });

    it('should store a reset token and send the email', async () => {
      (findUnique as any).mockResolvedValue(baseUser);
      (update as any).mockResolvedValue(baseUser);

      await authService.forgotPassword(baseUser.email);

      const call = (update as any).mock.calls[0][0];
      expect(call.data.resetPasswordToken).toMatch(/^[0-9a-f]{64}$/);
      expect(authMailer.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('should reject an invalid or expired token', async () => {
      (findFirst as any).mockResolvedValue(null);

      await expect(authService.resetPassword('bad', 'NewPwd123!')).rejects.toThrow(
        'Token invalide ou expiré',
      );
    });

    it('should hash the new password and clear the token', async () => {
      (findFirst as any).mockResolvedValue(baseUser);
      hash.mockResolvedValue('new_hash');
      (update as any).mockResolvedValue(baseUser);

      await authService.resetPassword('good', 'NewPwd123!');

      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { password: 'new_hash', resetPasswordToken: null, resetPasswordExpires: null },
      });
    });

      
  });

  describe('verifyEmail', () => {
    it('should reject an invalid token', async () => {
      (findFirst as any).mockResolvedValue(null);

      await expect(authService.verifyEmail('bad')).rejects.toThrow('Token invalide ou expiré');
    });

    it('should mark the email as verified', async () => {
      (findFirst as any).mockResolvedValue(baseUser);
      (update as any).mockResolvedValue(baseUser);

      await authService.verifyEmail('good');

      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ emailVerified: true }) }),
      );
    });
  });

  describe('changePassword', () => {
    it('should reject when the current password is wrong', async () => {
      (findUnique as any).mockResolvedValue(baseUser);
      compare.mockResolvedValue(false);

      await expect(
        authService.changePassword(baseUser.id, { currentPassword: 'bad', newPassword: 'New123!' } as any),
      ).rejects.toThrow('Mot de passe actuel incorrect');
    });

    it('should update the password when the current one is correct', async () => {
      (findUnique as any).mockResolvedValue(baseUser);
      compare.mockResolvedValue(true);
      hash.mockResolvedValue('new_hash');
      (update as any).mockResolvedValue(baseUser);

      await authService.changePassword(baseUser.id, {
        currentPassword: 'ok',
        newPassword: 'New123!',
      } as any);

      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { password: 'new_hash' },
      });
    });
        it('should throw a 404 when changing the password of an unknown user', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(
        authService.changePassword('unknown', { currentPassword: 'x', newPassword: 'New123!' } as any),
      ).rejects.toThrow('Utilisateur non trouvé');
      expect(compare).not.toHaveBeenCalled();
    });

  });
    describe('logout', () => {
    it('should clear the stored refresh token', async () => {
      (update as any).mockResolvedValue(baseUser);

      await authService.logout(baseUser.id);

      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { refreshToken: null },
      });
    });
  });

  describe('getLoggedUser', () => {
    it('should throw a 404 when the logged user does not exist', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(authService.getLoggedUser('unknown')).rejects.toThrow('Utilisateur non trouvé');
    });

    it('should return the user without sensitive fields', async () => {
      (findUnique as any).mockResolvedValue({
        ...baseUser,
        refreshToken: 'secret-refresh',
        twoFactorCode: '123456',
      });

      const result = await authService.getLoggedUser(baseUser.id);

      expect(result.email).toBe(baseUser.email);
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshToken');
      expect(result).not.toHaveProperty('twoFactorCode');
    });
  });

  describe('updateMe', () => {
    it('should reject an email already used by another user', async () => {
      (findUnique as any).mockResolvedValue({ id: 'other-user' });

      await expect(
        authService.updateMe(baseUser.id, { email: 'taken@test.com' } as any),
      ).rejects.toThrow('Email déjà utilisé');
    });

    it('should allow keeping its own email', async () => {
      (findUnique as any).mockResolvedValue({ id: baseUser.id });
      (update as any).mockResolvedValue({ ...baseUser, city: 'Ottawa' });

      const result = await authService.updateMe(baseUser.id, {
        email: baseUser.email,
        city: 'Ottawa',
      } as any);

      expect(result.city).toBe('Ottawa');
    });

    it('should update fields without hashing when no password is provided', async () => {
      (update as any).mockResolvedValue({ ...baseUser, city: 'Lyon' });

      await authService.updateMe(baseUser.id, { city: 'Lyon' } as any);

      expect(hash).not.toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { city: 'Lyon' },
      });
    });

    it('should hash the password when one is provided', async () => {
      hash.mockResolvedValue('hashed_new');
      (update as any).mockResolvedValue(baseUser);

      await authService.updateMe(baseUser.id, { password: 'NewPwd123!' } as any);

      expect(hash).toHaveBeenCalledWith('NewPwd123!', 12);
      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { password: 'hashed_new' },
      });
    });
  });

  describe('deleteMe', () => {
    it('should delete the user', async () => {
      (del as any).mockResolvedValue(baseUser);

      await authService.deleteMe(baseUser.id);

      expect(del).toHaveBeenCalledWith({ where: { id: baseUser.id } });
    });
  });

  describe('checkEmail', () => {
    it('should return the user when the email exists', async () => {
      (findUnique as any).mockResolvedValue(baseUser);

      await expect(authService.checkEmail(baseUser.email)).resolves.toEqual(baseUser);
    });

    it('should return null when the email is free', async () => {
      (findUnique as any).mockResolvedValue(null);

      await expect(authService.checkEmail('free@test.com')).resolves.toBeNull();
    });
  });

  describe('two-factor settings', () => {
    it('should enable two-factor authentication', async () => {
      (update as any).mockResolvedValue(baseUser);

      await authService.enableTwoFactor(baseUser.id);

      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { twoFactorEnabled: true },
      });
    });

    it('should disable two-factor authentication and clear any pending code', async () => {
      (update as any).mockResolvedValue(baseUser);

      await authService.disableTwoFactor(baseUser.id);

      expect(update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: {
          twoFactorEnabled: false,
          twoFactorCode: null,
          twoFactorExpires: null,
        },
      });
    });
  });

  describe('exportMe', () => {
    it('should return the user data with an export date', async () => {
      const exported = { firstName: 'Test', email: baseUser.email, watchlist: [], positions: [] };
      (findUnique as any).mockResolvedValue(exported);

      const result = await authService.exportMe(baseUser.id);

      expect(result.data).toEqual(exported);
      expect(new Date(result.exportDate).toString()).not.toBe('Invalid Date');
    });

    it('should never select the password nor the tokens', async () => {
      (findUnique as any).mockResolvedValue({});

      await authService.exportMe(baseUser.id);

      const select = (findUnique as any).mock.calls[0][0].select;
      expect(select).not.toHaveProperty('password');
      expect(select).not.toHaveProperty('refreshToken');
      expect(select).not.toHaveProperty('twoFactorCode');
    });
  });
});