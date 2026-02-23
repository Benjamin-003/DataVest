import { z } from 'zod';

// Schéma de validation pour l'inscription
// z.object() définit la forme attendue des données
// On enveloppe dans { body: ... } car validate.middleware.ts valide req.body
export const registerSchema = z.object({
  body: z.object({
    email: z.string().check(z.email('Adresse email invalide')),
    // min(8) vérifie que le mot de passe fait au moins 8 caractères
    password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
    // .optional() signifie que le champ n'est pas obligatoire
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
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