import { z } from 'zod';

// Règle de validation réutilisable pour le mot de passe
const passwordValidation = z
  .string()
  .min(12, 'Le mot de passe doit faire au moins 12 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial');

export const registerSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    password: passwordValidation,
    // Champs optionnels hérités d'Ottawa-Pigeon
    firstName:        z.string().min(1).optional(),
    lastName:         z.string().min(1).optional(),
    birthdate:        z.coerce.date().optional(),
    address:          z.string().min(1).optional(),
    zipcode:          z.string().min(1).optional(),
    city:             z.string().min(1).optional(),
    country:          z.string().min(1).optional(),
    newsletter:       z.boolean().optional(),
    subscriptionCode: z.string().min(1).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email:    z.string().check(z.email('Adresse email invalide')),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    // Champs auth existants
    firstName: z.string().min(1).optional(),
    lastName:  z.string().min(1).optional(),
    email:     z.string().check(z.email('Adresse email invalide')).optional(),
    password:  z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères').optional(),
    // Champs profil Ottawa-Pigeon
    birthdate:    z.coerce.date().optional(),
    address:      z.string().min(1).optional(),
    zipcode:      z.string().min(1).optional(),
    city:         z.string().min(1).optional(),
    country:      z.string().min(1).optional(),
    newsletter:   z.boolean().optional(),
    languageCode: z.string().min(1).optional(),
    currencyCode: z.string().min(1).optional(),
  }),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>['body'];

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Le refresh token est requis'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput    = z.infer<typeof loginSchema>['body'];

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword:     passwordValidation,
  }),
});

export const checkEmailSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
  }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type CheckEmailInput     = z.infer<typeof checkEmailSchema>['body'];

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token:       z.string().min(1, 'Token requis'),
    newPassword: passwordValidation,
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token requis'),
  }),
});

export const verifyTwoFactorSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    code:  z.string().length(6, 'Le code doit faire 6 chiffres'),
  }),
});

export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>['body'];
export type ForgotPasswordInput  = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput   = z.infer<typeof resetPasswordSchema>['body'];
export type VerifyEmailInput     = z.infer<typeof verifyEmailSchema>['body'];
