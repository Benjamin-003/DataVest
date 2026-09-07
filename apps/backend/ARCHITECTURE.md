# Architecture du projet Backend

## Structure des fichiers

```
Backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
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
│   │   ├── articles/
│   │   │   ├── article.service.ts
│   │   │   ├── article.controller.ts
│   │   │   └── article.routes.ts
│   │   ├── currencies/
│   │   │   ├── currency.controller.ts
│   │   │   └── currency.routes.ts
│   │   ├── languages/
│   │   │   ├── language.controller.ts
│   │   │   └── language.routes.ts
│   │   ├── subscriptions/
│   │   │   ├── subscription.controller.ts
│   │   │   └── subscription.routes.ts
│   │   ├── watchlist/
│   │   │   ├── watchlist.schema.ts
│   │   │   ├── watchlist.service.ts
│   │   │   ├── watchlist.controller.ts
│   │   │   └── watchlist.routes.ts
│   │   ├── portfolio/
│   │   │   ├── portfolio.schema.ts
│   │   │   ├── portfolio.service.ts
│   │   │   ├── portfolio.controller.ts
│   │   │   ├── portfolio.routes.ts
│   │   │   └── price.service.ts
│   │   └── prices/
│   │       ├── price-history.service.ts
│   │       ├── price-history.controller.ts
│   │       └── price-history.routes.ts
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

## Variables d'environnement

Fichier `.env` requis à la racine du projet :

| Variable | Obligatoire | Description | Exemple |
|---|---|---|---|
| `DATABASE_URL` | ✅ | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5433/mydb?schema=public` |
| `JWT_SECRET` | ✅ | Clé secrète access token | chaîne longue et aléatoire |
| `JWT_REFRESH_SECRET` | ✅ | Clé secrète refresh token | chaîne longue et aléatoire |
| `PORT` | — | Port d'écoute (défaut : 3000) | `3000` |
| `NODE_ENV` | — | Environnement (défaut : development) | `development` |
| `JWT_EXPIRES_IN` | — | Durée access token (défaut : 7d) | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | — | Durée refresh token (défaut : 30d) | `30d` |
| `CORS_ORIGIN` | — | Origine autorisée (défaut : localhost:5173) | `http://localhost:4200` |
| `RESEND_API_KEY` | — | Clé API Resend (emails) | `re_...` |
| `FRONTEND_URL` | — | URL du frontend (liens dans les emails) | `http://localhost:4200` |

---

## Prisma

### `prisma/schema.prisma`

**Modèle `User` :**
| Champ | Type | Description |
|---|---|---|
| id | String | Identifiant unique (cuid) |
| email | String | Email unique |
| password | String | Mot de passe hashé (bcrypt, coût 12) |
| firstName | String? | Prénom |
| lastName | String? | Nom |
| role | Role | Rôle : `USER` ou `ADMIN` |
| refreshToken | String? | Token de rafraîchissement JWT |
| birthdate | DateTime? | Date de naissance |
| address | String? | Adresse postale |
| zipcode | String? | Code postal |
| city | String? | Ville |
| country | String? | Pays |
| newsletter | Boolean | Abonné à la newsletter (défaut : false) |
| languageCode | String? | Référence vers `Language.code` |
| currencyCode | String? | Référence vers `Currency.code` |
| subscriptionCode | String? | Référence vers `Subscription.code` |
| emailVerified | Boolean | Email vérifié (défaut : false) |
| emailVerifyToken | String? | Token de vérification email |
| emailVerifyExpires | DateTime? | Expiration token de vérification |
| twoFactorEnabled | Boolean | 2FA activée (défaut : false) |
| twoFactorCode | String? | Code 2FA temporaire |
| twoFactorExpires | DateTime? | Expiration du code 2FA |
| resetPasswordToken | String? | Token de réinitialisation mot de passe |
| resetPasswordExpires | DateTime? | Expiration du token de réinitialisation |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Date de dernière modification |

**Modèle `Currency` :**
| Champ | Type | Description |
|---|---|---|
| code | String | Clé primaire (ex: `EUR`, `USD`) |
| label | String | Libellé affiché |
| flag | String | Code du drapeau (ex: `eu`, `us`) |

**Modèle `Language` :**
| Champ | Type | Description |
|---|---|---|
| code | String | Clé primaire (ex: `FR`, `EN`) |
| label | String | Libellé affiché |

**Modèle `WatchlistItem` :**
| Champ | Type | Description |
|---|---|---|
| id | String | Identifiant unique (cuid) |
| userId | String | Référence vers l'utilisateur propriétaire |
| symbol | String | Symbole de l'actif (ex: `AAPL`, `BTC-USD`) |
| name | String | Nom complet de l'actif |
| type | AssetType | Type : `STOCK`, `CRYPTO`, `COMMODITY`, `INDEX`, `FOREX` |
| createdAt | DateTime | Date d'ajout |

> Contrainte `@@unique([userId, symbol])` — un utilisateur ne peut pas ajouter le même symbole deux fois.

**Modèle `Position` :**
| Champ | Type | Description |
|---|---|---|
| id | String | Identifiant unique (cuid) |
| userId | String | Référence vers l'utilisateur propriétaire |
| symbol | String | Symbole de l'actif |
| name | String | Nom complet de l'actif |
| quantity | Float | Nombre d'unités détenues |
| buyPrice | Float | Prix d'achat unitaire (USD) |
| createdAt | DateTime | Date d'ajout |

> Le P&L et le prix actuel sont calculés à la volée via Yahoo Finance, non stockés en base.

**Modèle `Subscription` :**
| Champ | Type | Description |
|---|---|---|
| code | String | Clé primaire (ex: `FREE`, `PREMIUM`) |
| label | String | Libellé affiché |
| isDefault | Boolean | Abonnement par défaut à l'inscription |

### `prisma/seed.ts`

Insère les données de référence initiales (currencies, languages, subscriptions).

```bash
npx prisma db seed
```

### `prisma.config.ts`

Configuration Prisma v7 — schéma, migrations, seed et connexion à la base via `DATABASE_URL`.

---

## Configuration

### `src/config/env.ts`

Charge et valide les variables d'environnement au démarrage. Lance une exception si `DATABASE_URL`, `JWT_SECRET` ou `JWT_REFRESH_SECRET` sont absentes.

Exporte l'objet `config` utilisé dans toute l'application :
```typescript
config.port           // PORT
config.jwt.secret     // JWT_SECRET
config.jwt.expiresIn  // JWT_EXPIRES_IN
config.cors.origin    // CORS_ORIGIN
```

### `src/config/mailer.ts`

Initialise le client **Resend** avec `RESEND_API_KEY`. Exporte l'adresse expéditeur utilisée par `auth.mailer.ts`.

---

## Types TypeScript

### `src/types/env.d.ts`
Augmente `NodeJS.ProcessEnv` avec les types des variables d'environnement.

### `src/types/express.d.ts`
Augmente `Express.Request` avec `req.user` (profil utilisateur injecté par le middleware `authenticate`).

---

## Prisma Client

### `src/prisma/client.ts`

Singleton `PrismaClient` partagé dans toute l'application. Utilise `@prisma/adapter-pg` (requis par Prisma v7 avec PostgreSQL).

---

## Middlewares

### `src/middleware/auth.middleware.ts`

- **`authenticate`** — vérifie le Bearer token JWT, injecte `req.user`, retourne 401 si invalide ou expiré
- **`authorize(...roles)`** — vérifie que `req.user.role` est dans la liste, retourne 403 sinon

### `src/middleware/validate.middleware.ts`

Valide le body de la requête via un schéma Zod. Retourne 422 avec la liste des erreurs de validation si invalide.

### `src/middleware/error.middleware.ts`

Handler global d'erreurs Express. Gère :
- Erreurs Zod → 422
- `AppError` (erreurs métier) → code HTTP personnalisé
- Erreurs inattendues → 500

---

## Modules

### `src/modules/auth/`

**`auth.schema.ts`** — schémas Zod et types TypeScript :
- `registerSchema` / `loginSchema` / `refreshSchema`
- `updateMeSchema` / `changePasswordSchema`
- `checkEmailSchema`
- `forgotPasswordSchema` / `resetPasswordSchema`
- `verifyEmailSchema` / `verifyTwoFactorSchema`

**`auth.mailer.ts`** — emails transactionnels via Resend :
- `sendVerifyEmail(email, token)` — vérification email (token 24h)
- `sendResetPasswordEmail(email, token)` — réinitialisation mot de passe (token 1h)
- `sendTwoFactorCode(email, code)` — code 2FA (code 5 min)

**`auth.service.ts`** — logique métier :

| Fonction | Description |
|---|---|
| `register` | Crée le compte, envoie l'email de vérification |
| `login` | Vérifie les credentials, génère et envoie le code 2FA |
| `verifyTwoFactor` | Valide le code 2FA, retourne les tokens JWT |
| `refresh` | Renouvelle la paire access/refresh token |
| `logout` | Invalide le refresh token en base |
| `getLoggedUser` | Retourne le profil complet (sans données sensibles) |
| `updateMe` | Met à jour les champs du profil (optionnels) |
| `deleteMe` | Supprime le compte |
| `checkEmail` | Vérifie la disponibilité d'un email |
| `changePassword` | Change le mot de passe (vérifie l'ancien) |
| `forgotPassword` | Génère un token de reset et envoie l'email |
| `resetPassword` | Réinitialise le mot de passe via le token |
| `verifyEmail` | Valide l'adresse email via le token |

**`auth.routes.ts`** :

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter (étape 1) |
| POST | `/api/auth/2fa/verify` | Public | Valider le code 2FA (étape 2) |
| POST | `/api/auth/refresh` | Public | Renouveler les tokens |
| POST | `/api/auth/check-email` | Public | Vérifier la disponibilité d'un email |
| POST | `/api/auth/forgot-password` | Public | Demander une réinitialisation |
| POST | `/api/auth/reset-password` | Public | Réinitialiser le mot de passe |
| POST | `/api/auth/verify-email` | Public | Vérifier l'adresse email |
| POST | `/api/auth/logout` | 🔒 Protégé | Se déconnecter |
| GET | `/api/auth/me` | 🔒 Protégé | Voir son profil |
| PATCH | `/api/auth/me` | 🔒 Protégé | Modifier son profil |
| PATCH | `/api/auth/password` | 🔒 Protégé | Changer son mot de passe |
| DELETE | `/api/auth/me` | 🔒 Protégé | Supprimer son compte |

---

### `src/modules/articles/`

Proxy RSS — récupère le contenu XML d'un flux RSS externe et le retourne brut au frontend. L'URL est encodée en base64 pour éviter les conflits avec les slashes dans la route Express.

**`article.service.ts`** :
- `getArticles(encodedUrl)` — décode l'URL base64, fetche le flux RSS, retourne le XML brut

**`article.routes.ts`** :

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/articles/:url` | 🔒 Protégé | Proxifier un flux RSS (`:url` = URL encodée en base64) |

---

### `src/modules/currencies/`

Données de référence — liste des devises disponibles.

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/currencies` | Public | Liste toutes les devises |

---

### `src/modules/languages/`

Données de référence — liste des langues disponibles.

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/languages` | Public | Liste toutes les langues |

---

### `src/modules/subscriptions/`

Données de référence — liste des abonnements disponibles.

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/subscriptions` | Public | Liste tous les abonnements |

---

## Flux d'une requête

```
Requête HTTP
     ↓
cors()              ← vérifie l'origine (CORS_ORIGIN)
     ↓
express.json()      ← parse le body JSON
     ↓
authenticate()      ← vérifie le Bearer token (routes protégées)
     ↓
validate(schema)    ← valide le body avec Zod
     ↓
controller          ← gestion req/res
     ↓
service             ← logique métier + Prisma
     ↓
mailer              ← envoi email si nécessaire (Resend)
     ↓
Réponse JSON
     ↓ (erreur)
errorHandler        ← 422 / 4xx / 500
```

---

## Flux d'authentification avec 2FA

```
1. POST /api/auth/login (email + password)
   → credentials vérifiés en base
   → code 2FA généré, hashé et stocké (expire dans 5 min)
   → email envoyé via Resend
   → { twoFactorRequired: true }

2. POST /api/auth/2fa/verify (email + code)
   → code comparé et expiration vérifiée
   → { user, accessToken (7j), refreshToken (30j) }

3. Requêtes protégées
   → Authorization: Bearer <accessToken>

4. Access token expiré → 401
   → POST /api/auth/refresh → nouveaux tokens
   → L'intercepteur Angular rejoue la requête originale

5. Refresh token expiré → 401
   → forceLogout() → redirection /authentication/connexion
```

---

## Flux de vérification email

```
1. POST /api/auth/register → email de vérification envoyé (token 24h)
2. Clic sur le lien → POST /api/auth/verify-email { token }
   → emailVerified = true
```

---

## Flux de réinitialisation mot de passe

```
1. POST /api/auth/forgot-password { email }
   → email envoyé avec lien contenant le token (expire 1h)
2. POST /api/auth/reset-password { token, newPassword }
   → mot de passe hashé et mis à jour
   → token invalidé
```

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | 5.9 | Typage statique |
| Express | 5.x | Framework HTTP |
| Prisma | 7.x | ORM |
| @prisma/adapter-pg | 7.x | Adaptateur PostgreSQL pour Prisma v7 |
| PostgreSQL | 16 | Base de données |
| Docker | — | Conteneur PostgreSQL de développement |
| jsonwebtoken | 9.x | Génération et vérification des JWT |
| bcryptjs | 3.x | Hash des mots de passe (coût 12) |
| Zod | 4.x | Validation des données |
| Resend | 6.x | Emails transactionnels |
| Vitest | 4.x | Tests unitaires |
| ts-node-dev | 2.x | Hot reload en développement |

---

## Démarrage

```bash
# 1. Démarrer PostgreSQL
docker run -d --name database \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5433:5432 postgres:16

# 2. Configurer .env
cp .env.example .env
# Renseigner DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 3. Installer les dépendances
npm install

# 4. Appliquer les migrations
npx prisma migrate dev

# 5. Seeder les données de référence
npx prisma db seed

# 6. Démarrer le serveur
npm run dev
# → http://localhost:3000
```