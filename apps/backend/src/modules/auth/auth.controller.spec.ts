import { vi, describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { authController } from './auth.controller';
import { prisma } from '../../prisma/client';
import { authMailer } from './auth.mailer';

vi.mock('../../prisma/client', () => ({
  prisma: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));

vi.mock('bcrypt', () => ({ default: { compare: vi.fn() }, compare: vi.fn() }));

vi.mock('./auth.mailer', () => ({
  authMailer: {
    sendTwoFactorCode: vi.fn().mockResolvedValue(undefined),
    sendVerifyEmail: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('./auth.service', () => ({ authService: {} }));

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('authController.login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should store a 6-digit numeric 2FA code and send it by email', async () => {
    const user = {
      id: 'u1',
      email: 'test@test.com',
      password: 'hashed',
      emailVerified: true,
      firstName: 'Test',
    };
    (prisma.user.findUnique as any).mockResolvedValue(user);
    (bcrypt.compare as any).mockResolvedValue(true);
    const res = mockRes();

    await authController.login(
      { body: { email: user.email, password: 'MonMotDePasse123!' } } as any,
      res,
    );

    const data = (prisma.user.update as any).mock.calls[0][0].data;
    expect(data.twoFactorCode).toMatch(/^\d{6}$/);
    expect(authMailer.sendTwoFactorCode).toHaveBeenCalledWith(user.email, data.twoFactorCode, 'Test');
    expect(res.json).toHaveBeenCalledWith({ twoFactorRequired: true });
  });

  it('should reject invalid credentials with a 401', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    const res = mockRes();

    await authController.login({ body: { email: 'x@x.com', password: 'bad' } } as any, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should ask for email verification before sending any code', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'u1',
      email: 'test@test.com',
      password: 'hashed',
      emailVerified: false,
    });
    (bcrypt.compare as any).mockResolvedValue(true);
    const res = mockRes();

    await authController.login({ body: { email: 'test@test.com', password: 'ok' } } as any, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ emailNotVerified: true }));
    expect(authMailer.sendTwoFactorCode).not.toHaveBeenCalled();
  });
});