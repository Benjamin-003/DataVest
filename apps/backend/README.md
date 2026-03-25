# Projet Fullstack — Auth App

Application fullstack avec authentification complète, 2FA par email, gestion de profil, et conversion de fichiers XML en arborescence (data tree).

---

## Stack technique

### Backend
- Node.js + Express + TypeScript
- Prisma v7 + PostgreSQL 16
- JWT (access + refresh tokens)
- Zod (validation)
- bcryptjs (hash mot de passe)
- Resend (envoi emails)
- Multer (upload de fichiers)
- xml2js (parsing XML)

### Frontend
- Vite + React + TypeScript
- React Router DOM
- Axios (avec intercepteurs)
- Material UI (MUI)

---

## Prérequis

- Node.js 18+
- Docker (pour PostgreSQL)

---

## Installation

### 1. Base de données

```bash
docker run --name database \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env  # puis remplir les variables
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Variables d'environnement

### Backend (.env)

```
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
JWT_SECRET=un_secret_long_et_complexe
JWT_REFRESH_SECRET=un_autre_secret_long_et_complexe
CORS_ORIGIN=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=/api
```

---

## Commandes utiles

```bash
# Backend
docker start database
npm run dev
npx prisma generate
npx prisma migrate dev
npx prisma studio         # http://localhost:5555

# Frontend
npm run dev               # http://localhost:5173
```

---

## Flux d'authentification

```
1. POST /register       → inscription + email de vérification
2. POST /verify-email   → validation du compte
3. POST /login          → { twoFactorRequired: true } + code 2FA envoyé
4. POST /2fa/verify     → { user, accessToken, refreshToken }
5. Requêtes protégées   → Authorization: Bearer <accessToken>
6. Token expiré         → POST /refresh → nouveaux tokens
7. POST /logout         → déconnexion
```

---

## Conversion XML → Data Tree

```
1. POST /api/conversions        → upload d'un fichier XML → arborescence JSON retournée
2. GET  /api/conversions        → liste de toutes ses conversions
3. GET  /api/conversions/:id    → détail d'une conversion
4. DELETE /api/conversions/:id  → suppression d'une conversion
```

---

## Règles mot de passe

- 12 caractères minimum
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial