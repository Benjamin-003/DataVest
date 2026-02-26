import { z } from 'zod';

// Règle de validation réutilisable pour le mot de passe
const passwordValidation = z
  .string()
  .min(12, 'Le mot de passe doit faire au moins 12 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial');

// Schéma de validation pour l'inscription
// z.object() définit la forme attendue des données
// On enveloppe dans { body: ... } car validate.middleware.ts valide req.body
export const registerSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    // min(8) vérifie que le mot de passe fait au moins 8 caractères
    password: passwordValidation
  }),
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});


// Schéma pour la mise à jour partielle du profil
// Tous les champs sont optionnels avec .partial()
export const updateMeSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().check(z.email('Adresse email invalide')).optional(),
    // Si le mot de passe est fourni, il doit faire au moins 8 caractères
    password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères').optional(),
  }),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>['body'];

// Schéma de validation pour le renouvellement du token
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Le refresh token est requis'),
  }),
});

// On exporte les types TypeScript générés automatiquement par Zod
// Cela évite de redéfinir manuellement les interfaces LoginInput, RegisterInput...
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit faire au moins 8 caractères'),
  }),
});

export const checkEmailSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
  }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type CheckEmailInput = z.infer<typeof checkEmailSchema>['body'];

// Schéma pour la demande de réinitialisation du mot de passe
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
  }),
});

// Schéma pour la réinitialisation du mot de passe via le token
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token requis'),
    newPassword: passwordValidation,
  }),
});

// Schéma pour la vérification de l'email
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token requis'),
  }),
});

// Schéma pour la vérification du code 2FA
export const verifyTwoFactorSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    code: z.string().length(6, 'Le code doit faire 6 chiffres'),
  }),
});

export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>['body'];

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['body'];