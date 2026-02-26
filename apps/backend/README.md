# Backend — API REST

API REST construite avec **Express**, **TypeScript**, **Prisma v7** et **PostgreSQL**.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"

JWT_SECRET=votre_secret_jwt_long_et_complexe
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=votre_secret_refresh_long_et_complexe
JWT_REFRESH_EXPIRES_IN=30d

CORS_ORIGIN=http://localhost:5173

RESEND_API_KEY=votre_cle_api_resend
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Ne commitez jamais le fichier `.env`.

---

## Lancer PostgreSQL avec Docker

```bash
docker run --name database \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:16
```

```bash
docker start database   # démarrer
docker stop database    # arrêter
docker rm database      # supprimer
```

> ⚠️ Le conteneur doit être démarré avant de lancer le serveur.

---

## Base de données

```bash
npx prisma generate       # générer le client
npx prisma migrate dev    # lancer les migrations
npx prisma studio         # interface visuelle (http://localhost:5555)
```

---

## Lancer le serveur

```bash
npm run dev       # développement
npm run build     # compiler
npm start         # production
```

```
✅ Database connected
🚀 Server running on http://localhost:3000
📌 Environment: development
```

---

## Routes disponibles

### Santé
| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Vérifier que le serveur tourne |

### Authentification — `/api/auth`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter (retourne twoFactorRequired) |
| POST | `/api/auth/2fa/verify` | Public | Vérifier le code 2FA et obtenir les tokens |
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

## Sécurité

- **2FA obligatoire** par email à chaque connexion (code valable 5 minutes)
- **JWT** access token (7 jours) + refresh token (30 jours)
- **Bcrypt** pour le hash des mots de passe (coût 12)
- **Zod** pour la validation des données entrantes
- Mot de passe : minimum 12 caractères, majuscule, minuscule, chiffre, caractère spécial

---

## Emails transactionnels (Resend)

| Email | Déclencheur | Expiration |
|---|---|---|
| Vérification email | Inscription | 24 heures |
| Code 2FA | Connexion | 5 minutes |
| Réinitialisation mot de passe | Forgot password | 1 heure |

---

## Stack technique

| Outil | Rôle |
|---|---|
| Express | Framework HTTP |
| TypeScript | Typage statique |
| Prisma v7 | ORM |
| PostgreSQL 16 | Base de données |
| Docker | Conteneur PostgreSQL |
| JWT | Authentification |
| Bcrypt | Hash des mots de passe |
| Zod | Validation des données |
| Resend | Envoi d'emails transactionnels |
| @prisma/adapter-pg | Adapter PostgreSQL pour Prisma v7 |

---

## Structure du projet

```
src/
├── config/         → Variables d'environnement + configuration Resend
├── middleware/     → Auth, validation, gestion des erreurs
├── modules/
│   └── auth/      → Schema, service, controller, routes, mailer
├── prisma/        → Client Prisma singleton
└── types/         → Types TypeScript globaux
```