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
│   │   ├── auth/
│   │   │   ├── auth.mailer.ts
│   │   │   ├── auth.schema.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.routes.ts
│   │   └── conversions/
│   │       ├── conversion.schema.ts
│   │       ├── conversion.service.ts
│   │       ├── conversion.controller.ts
│   │       └── conversion.routes.ts
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
Décrit la structure de la base de données. Contient le modèle `User` avec tous ses champs.

**Champs du modèle User :**
| Champ | Type | Description |
|---|---|---|
| id | String | Identifiant unique (cuid) |
| email | String | Email unique |
| password | String | Mot de passe hashé (bcrypt) |
| firstName | String? | Prénom (optionnel) |
| lastName | String? | Nom (optionnel) |
| role | Role | Rôle (USER ou ADMIN) |
| refreshToken | String? | Token de rafraîchissement |
| emailVerified | Boolean | Email vérifié (défaut : false) |
| emailVerifyToken | String? | Token de vérification email |
| emailVerifyExpires | DateTime? | Expiration du token de vérification |
| twoFactorEnabled | Boolean | 2FA activée (défaut : false) |
| twoFactorCode | String? | Code 2FA |
| twoFactorExpires | DateTime? | Expiration du code 2FA |
| resetPasswordToken | String? | Token de réinitialisation |
| resetPasswordExpires | DateTime? | Expiration du token de réinitialisation |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de mise à jour |

### `prisma.config.ts`
Configuration Prisma v7 — schéma, migrations et connexion à la base.

**Champs du modèle Conversion :**
| Champ | Type | Description |
|---|---|---|
| id | String | Identifiant unique (cuid) |
| userId | String | Référence vers l'utilisateur propriétaire |
| fileName | String | Nom du fichier XML uploadé |
| xmlContent | String | Contenu brut du fichier XML (`@db.Text`) |
| jsonContent | String | Représentation JSON du XML (`@db.Text`) |
| treeContent | String | Tableau plat de nœuds représentant l'arborescence (`@db.Text`) |
| createdAt | DateTime | Date de création |

> La relation `User → Conversion` est en `onDelete: Cascade` : supprimer un utilisateur supprime toutes ses conversions.

> **Structure d'un nœud `treeContent` :**
> - `id` — index du nœud
> - `tag` — nom du tag XML (`user_name` pour le nœud racine)
> - `value` — valeur textuelle du nœud (vide si nœud parent)
> - `parentId` — id du nœud parent (−1 pour la racine)
> - `children` — tableau des `id` des enfants directs

---

## Configuration

### `src/config/env.ts`
Charge et valide toutes les variables d'environnement au démarrage.

### `src/config/mailer.ts`
Initialise le client **Resend** avec la clé API et exporte l'adresse expéditeur.

---

## Types TypeScript

### `src/types/env.d.ts`
Déclare les variables d'environnement pour TypeScript.

### `src/types/express.d.ts`
Étend le type `Request` d'Express pour y ajouter `req.user`.

---

## Prisma Client

### `src/prisma/client.ts`
Singleton `PrismaClient` partagé dans toute l'application.
Utilise `@prisma/adapter-pg` requis par Prisma v7.

---

## Middlewares

### `src/middleware/error.middleware.ts`
Intercepte toutes les erreurs — Zod (422), AppError, erreurs inattendues (500).

### `src/middleware/validate.middleware.ts`
Valide les données d'une requête via un schéma Zod. Retourne 422 si invalide.

### `src/middleware/auth.middleware.ts`
- **`authenticate`** : vérifie le token JWT et injecte `req.user`
- **`authorize(...roles)`** : vérifie le rôle de l'utilisateur

---

## Modules

### `src/modules/auth/auth.schema.ts`
Définit toutes les règles de validation Zod et exporte les types TypeScript associés.

**Schémas disponibles :**
- `registerSchema` / `loginSchema` / `refreshSchema`
- `updateMeSchema` / `changePasswordSchema`
- `checkEmailSchema`
- `forgotPasswordSchema` / `resetPasswordSchema`
- `verifyEmailSchema`
- `verifyTwoFactorSchema`

**Règle `passwordValidation` (réutilisée dans tous les schémas) :**
- Minimum 12 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial

### `src/modules/auth/auth.mailer.ts`
Templates HTML des emails transactionnels envoyés via Resend :
- **`sendVerifyEmail`** — vérification email (token 24h)
- **`sendResetPasswordEmail`** — réinitialisation mot de passe (token 1h)
- **`sendTwoFactorCode`** — code 2FA (code 5 min)

### `src/modules/auth/auth.service.ts`
Logique métier complète, découpée en petites fonctions.

**Fonctions utilitaires (hors authService) :**
- `generateTokens` — paire access/refresh token
- `generateSecureToken` — token aléatoire sécurisé (crypto)
- `sanitizeUser` — retire les données sensibles
- `checkEmailAvailability` — vérifie qu'un email n'est pas utilisé
- `hashPassword` — hash bcrypt (coût 12)
- `createUser` — création en base
- `saveRefreshToken` — sauvegarde refresh token
- `updateUser` — mise à jour partielle

**Méthodes de authService :**
- **`register`** — inscription + email de vérification
- **`login`** — vérification credentials + envoi code 2FA
- **`verifyTwoFactor`** — vérification code 2FA + retour tokens
- **`refresh`** — renouvellement tokens
- **`logout`** — invalidation refresh token
- **`getLoggedUser`** — profil utilisateur connecté
- **`updateMe`** — mise à jour partielle du profil
- **`deleteMe`** — suppression du compte
- **`exportMe`** — export RGPD des données personnelles (Art. 20)
- **`checkEmail`** — disponibilité d'un email
- **`changePassword`** — changement mot de passe
- **`forgotPassword`** — demande réinitialisation + email
- **`resetPassword`** — réinitialisation via token
- **`verifyEmail`** — validation adresse email

### `src/modules/auth/auth.controller.ts`
Lien entre routes et service. Gestion req/res uniquement, aucune logique métier.

### `src/modules/auth/auth.routes.ts`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| POST | `/api/auth/2fa/verify` | Public | Vérifier le code 2FA |
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
| GET | `/api/auth/me/export` | Protégé 🔒 | Exporter ses données (RGPD Art. 20) |

### `src/modules/conversions/conversion.schema.ts`
Schémas Zod pour la validation des données du module conversions.

**Schémas disponibles :**
- `createConversionSchema` — valide que le fichier uploadé est bien un XML

### `src/modules/conversions/conversion.service.ts`
Logique métier du module conversions.

**Méthodes :**
- **`create`** — parse le fichier XML, génère le JSON intermédiaire (`jsonContent`) et le tableau plat de nœuds (`treeContent`), puis persiste les 3 représentations en base
- **`findAll`** — récupère toutes les conversions de l'utilisateur connecté
- **`findOne`** — récupère une conversion par son id (vérifie l'ownership)
- **`delete`** — supprime une conversion (vérifie l'ownership)

### `src/modules/conversions/conversion.controller.ts`
Lien entre routes et service. Gestion req/res uniquement, aucune logique métier.

### `src/modules/conversions/conversion.routes.ts`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/conversions` | Protégé 🔒 | Uploader un XML et générer l'arborescence |
| GET | `/api/conversions` | Protégé 🔒 | Lister toutes ses conversions |
| GET | `/api/conversions/:id` | Protégé 🔒 | Voir une conversion |
| DELETE | `/api/conversions/:id` | Protégé 🔒 | Supprimer une conversion |

---

## Flux d'une requête

```
Requête HTTP
     ↓
authenticate        ← vérifie le token JWT (routes protégées)
     ↓
validate(schema)    ← vérifie les données (Zod)
     ↓
controller          ← gestion req/res
     ↓
service             ← logique métier + Prisma
     ↓
mailer              ← envoi email si nécessaire
     ↓
Réponse JSON
     ↓ (erreur)
errorHandler
```

---

## Flux d'authentification avec 2FA

```
1. POST /login (email + password)
   → credentials vérifiés
   → code 2FA généré et envoyé par email (5 min)
   → { twoFactorRequired: true }

2. POST /2fa/verify (email + code)
   → code vérifié
   → { user, accessToken, refreshToken }

3. Requêtes protégées
   → Authorization: Bearer accessToken

4. Access token expiré → 401
   → POST /refresh → nouveaux tokens

5. Refresh token expiré → 401
   → redirection /login
```

---

## Flux de vérification email

```
1. POST /register → email de vérification envoyé (24h)
2. POST /verify-email avec token → emailVerified = true
```

---

## Flux de réinitialisation mot de passe

```
1. POST /forgot-password → email envoyé si compte existe (1h)
2. POST /reset-password avec token + nouveau mot de passe → OK
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
| Resend | - | Emails transactionnels |
---

## Conformité RGPD

Le backend implémente les mesures suivantes conformément au Règlement Général sur la Protection des Données (UE 2016/679) :

### Droits des utilisateurs implémentés

| Droit | Article RGPD | Implémentation |
|---|---|---|
| Accès | Art. 15 | `GET /api/auth/me` |
| Rectification | Art. 16 | `PATCH /api/auth/me` |
| Effacement | Art. 17 | `DELETE /api/auth/me` (cascade Prisma sur toutes les tables) |
| Portabilité | Art. 20 | `GET /api/auth/me/export` — JSON structuré |

### Mesures techniques

- **Chiffrement des mots de passe** : bcrypt (facteur de coût 12)
- **Tokens sécurisés** : générés via `crypto.randomBytes` (OTP 2FA, reset password, verify email)
- **Durées d'expiration** :
  - Access token JWT : courte durée
  - Code 2FA : 5 minutes
  - Token reset password : 1 heure
  - Token vérification email : 24 heures
- **Champs sensibles filtrés** : `sanitizeUser()` retire password, tokens et codes avant tout renvoi client
- **Variables d'environnement** : `.env` listé dans `.gitignore` — ne jamais commiter

### Sous-traitants

| Sous-traitant | Rôle | Base légale transfert |
|---|---|---|
| Resend | Emails transactionnels | Clauses contractuelles types (Art. 46 RGPD) |