# Architecture du projet Backend

## Structure des fichiers

```
Backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── mailer.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.mailer.ts
│   │       ├── auth.schema.ts
│   │       ├── auth.service.ts
│   │       ├── auth.controller.ts
│   │       └── auth.routes.ts
│   ├── prisma/
│   │   └── client.ts
│   └── types/
│       ├── env.d.ts
│       └── express.d.ts
├── .env
├── .env.example
├── .gitignore
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

---

## Prisma

### `prisma/schema.prisma`
Décrit la structure de la base de données.
Contient le modèle `User` avec tous ses champs dont les nouveaux champs pour la vérification email et la réinitialisation de mot de passe.

### `prisma.config.ts`
Fichier de configuration propre à Prisma v7.
Indique à Prisma où se trouve le schéma, les migrations, et comment se connecter à la base via `DATABASE_URL`.

---

## Configuration

### `src/config/env.ts`
Charge et valide toutes les variables d'environnement au démarrage du serveur.
Si une variable obligatoire est manquante, le serveur refuse de démarrer avec un message d'erreur clair.

### `src/config/mailer.ts`
Initialise le client **Resend** avec la clé API.
Exporte l'instance `resend` et l'adresse expéditeur `FROM_EMAIL`.

---

## Types TypeScript

### `src/types/env.d.ts`
Déclare à TypeScript quelles variables existent dans `process.env`.

### `src/types/express.d.ts`
Étend le type `Request` d'Express pour y ajouter la propriété `user`.

---

## Prisma Client

### `src/prisma/client.ts`
Crée et exporte une seule instance de `PrismaClient` partagée dans toute l'application.
Utilise l'adapter `@prisma/adapter-pg` requis par Prisma v7.

---

## Middlewares

### `src/middleware/error.middleware.ts`
Intercepte toutes les erreurs et retourne une réponse JSON propre.
Gère : erreurs Zod (422), erreurs métier AppError, erreurs inattendues (500).

### `src/middleware/validate.middleware.ts`
Valide les données d'une requête via un schéma Zod.

### `src/middleware/auth.middleware.ts`
- **`authenticate`** : vérifie le token JWT et injecte `req.user`
- **`authorize(...roles)`** : vérifie le rôle de l'utilisateur

---

## Modules

### `src/modules/auth/auth.schema.ts`
Définit toutes les règles de validation Zod.

Règles de validation du mot de passe :
- Minimum **12 caractères**
- Au moins **une majuscule**
- Au moins **une minuscule**
- Au moins **un chiffre**
- Au moins **un caractère spécial**

### `src/modules/auth/auth.mailer.ts`
Contient les templates HTML des emails transactionnels :
- **`sendVerifyEmail`** — email de vérification après inscription (token valide 24h)
- **`sendResetPasswordEmail`** — email de réinitialisation de mot de passe (token valide 1h)

### `src/modules/auth/auth.service.ts`
Contient toute la logique métier, découpée en petites fonctions avec un rôle précis.

Fonctions utilitaires (hors authService) :
- `generateTokens` — génère la paire access/refresh token
- `generateSecureToken` — génère un token aléatoire sécurisé
- `sanitizeUser` — retire les données sensibles avant de retourner l'utilisateur
- `checkEmailAvailability` — vérifie qu'un email n'est pas déjà utilisé
- `hashPassword` — hash le mot de passe avec bcrypt
- `createUser` — crée l'utilisateur en base
- `saveRefreshToken` — sauvegarde le refresh token en base
- `updateUser` — met à jour partiellement le profil

Méthodes de authService :
- **`register`** — inscription + envoi email de vérification
- **`login`** — connexion
- **`refresh`** — renouvellement des tokens
- **`logout`** — invalidation du refresh token
- **`getLoggedUser`** — profil de l'utilisateur connecté
- **`updateMe`** — mise à jour partielle du profil
- **`deleteMe`** — suppression du compte
- **`checkEmail`** — vérification de disponibilité d'un email
- **`changePassword`** — changement de mot de passe
- **`forgotPassword`** — demande de réinitialisation + envoi email
- **`resetPassword`** — réinitialisation via token
- **`verifyEmail`** — validation de l'adresse email via token

### `src/modules/auth/auth.controller.ts`
Fait le lien entre les routes et le service.
Ne contient aucune logique métier, uniquement de la gestion req/res.

### `src/modules/auth/auth.routes.ts`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| POST | `/api/auth/refresh` | Public | Renouveler le token |
| POST | `/api/auth/check-email` | Public | Vérifier si un email existe |
| POST | `/api/auth/forgot-password` | Public | Demander une réinitialisation |
| POST | `/api/auth/reset-password` | Public | Réinitialiser le mot de passe |
| POST | `/api/auth/verify-email` | Public | Vérifier l'adresse email |
| POST | `/api/auth/logout` | Protégé 🔒 | Se déconnecter |
| GET | `/api/auth/me` | Protégé 🔒 | Voir son profil |
| PATCH | `/api/auth/me` | Protégé 🔒 | Modifier son profil |
| PATCH | `/api/auth/password` | Protégé 🔒 | Changer son mot de passe |
| DELETE | `/api/auth/me` | Protégé 🔒 | Supprimer son compte |

---

## Flux d'une requête

```
Requête HTTP
     ↓
authenticate        ← vérifie le token JWT (routes protégées)
     ↓
validate(schema)    ← vérifie les données envoyées par le client
     ↓
controller          ← traite la requête et appelle le service
     ↓
service             ← logique métier + appels à la base via Prisma
     ↓
mailer              ← envoi d'email si nécessaire (register, forgot-password)
     ↓
Réponse JSON
     ↓ (en cas d'erreur)
errorHandler        ← formate et retourne l'erreur au client
```

---

## Flux d'authentification JWT

```
1. POST /login
   ← accessToken (valide 7 jours) + refreshToken (valide 30 jours)

2. Requêtes protégées
   → Authorization: Bearer accessToken
   ← réponse normale

3. Access token expiré
   ← 401 Unauthorized

4. POST /refresh avec le refreshToken
   ← nouveau accessToken + refreshToken

5. Si refresh token expiré
   ← 401 → redirection vers /login
```

---

## Flux de vérification email

```
1. POST /register
   → compte créé + email de vérification envoyé (token valide 24h)

2. Utilisateur clique sur le lien dans l'email
   → POST /verify-email avec le token
   ← emailVerified = true
```

---

## Flux de réinitialisation de mot de passe

```
1. POST /forgot-password avec l'email
   → email envoyé si le compte existe (token valide 1h)

2. Utilisateur clique sur le lien dans l'email
   → POST /reset-password avec le token + nouveau mot de passe
   ← mot de passe mis à jour + token supprimé
```

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.x | Typage statique |
| Express | 4.x | Framework HTTP |
| Prisma | 7.x | ORM |
| PostgreSQL | 16 | Base de données |
| Docker | - | Conteneur PostgreSQL |
| JWT | - | Authentification |
| Bcrypt | - | Hash des mots de passe |
| Zod | - | Validation des données |
| Resend | - | Envoi d'emails transactionnels |
| @prisma/adapter-pg | - | Adapter PostgreSQL pour Prisma v7 |