import { vi, describe, it, expect, beforeEach } from 'vitest';
import { authService } from './auth.service';
import { prisma } from '../../prisma/client';
import bcrypt from 'bcryptjs';

// 1. On intercepte l'import de prisma
vi.mock('../../prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Réinitialise les compteurs entre chaque test
  });

  it('should fail if email is already taken', async () => {
    // 2. On définit ce que findUnique doit répondre pour CE test
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing-id' });

    // 3. On appelle la méthode register (qui devrait échouer selon ta doc)
    await expect(authService.register({
      email: 'qsd@qsd.com',
      password: 'MonMotDePasse123!'
    })).rejects.toThrow('Email déjà utilisé');
  });

  it('should return twoFactorRequired when login credentials are valid', async () => {
  // 1. On simule un utilisateur trouvé avec le bon mot de passe
  const mockUser = {
    id: 'user-123',
    email: 'test@test.com',
    password: 'hashed_password',
  };
  (prisma.user.findUnique as any).mockResolvedValue(mockUser);

  // On simule que bcrypt.compare renvoie true (mot de passe correct)
  vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

  // 2. Appel du service login
  const result = await authService.login({
    email: 'test@test.com',
    password: 'MonMotDePasse123!'
  });

  // 3. Vérifications selon ta doc API
  expect(result).toEqual({ twoFactorRequired: true }); //
  
  // Optionnel : vérifier qu'un code a été généré en base (si ton service le fait ici)
  expect(prisma.user.update).toHaveBeenCalled(); 
});
});