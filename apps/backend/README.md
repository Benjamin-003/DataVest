# Backend — API REST

API REST construite avec **Express**, **TypeScript**, **Prisma v7** et **PostgreSQL**.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (pour PostgreSQL)
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

Copiez le fichier `.env.example` et renommez-le `.env` :

```bash
cp .env.example .env
```

Puis remplissez les valeurs dans `.env` :

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"

JWT_SECRET=votre_secret_jwt_long_et_complexe
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=votre_secret_refresh_long_et_complexe
JWT_REFRESH_EXPIRES_IN=30d

CORS_ORIGIN=http://localhost:5173
```

> ⚠️ Ne commitez jamais le fichier `.env` — il contient des informations sensibles.

---

## Lancer PostgreSQL avec Docker

### Démarrer le conteneur

```bash
docker run --name database \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:16
```

### Vérifier que le conteneur tourne

```bash
docker ps
```

Vous devriez voir le conteneur `database` avec le statut **Up**.

### Commandes utiles Docker

```bash
docker start database   # démarrer le conteneur
docker stop database    # arrêter le conteneur
docker rm database      # supprimer le conteneur
```

> ⚠️ Le conteneur doit être démarré avant de lancer le serveur.

---

## Base de données

### Générer le client Prisma

```bash
npx prisma generate
```

### Lancer les migrations

```bash
npx prisma migrate dev
```

### Visualiser les données (optionnel)

```bash
npx prisma studio
```

Ouvre une interface web sur `http://localhost:5555`.

---

## Lancer le serveur

### Mode développement (avec rechargement automatique)

```bash
npm run dev
```

### Mode production

```bash
npm run build
npm start
```

Si tout fonctionne, vous devriez voir dans le terminal :

```
✅ Database connected
🚀 Server running on http://localhost:3000
📌 Environment: development
```

---

## Routes disponibles

### Authentification — `/api/auth`

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| POST | `/api/auth/refresh` | Public | Renouveler le token |
| POST | `/api/auth/logout` | Protégé 🔒 | Se déconnecter |
| GET | `/api/auth/me` | Protégé 🔒 | Voir son profil |

### Santé du serveur

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Vérifier que le serveur tourne |

---

## Tester l'API

Vous pouvez tester les routes avec [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).

### Exemple — Register

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "email": "test@test.com",
    "password": "motdepasse123",
    "firstName": "John",
    "lastName": "Doe"
}
```

### Exemple — Routes protégées

Ajoutez le header `Authorization` avec le token reçu lors du login :

```
Authorization: Bearer <accessToken>
```

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
| @prisma/adapter-pg | Adapter PostgreSQL pour Prisma v7 |

---

## Structure du projet

```
src/
├── config/         → Variables d'environnement
├── middleware/     → Auth, validation, gestion des erreurs
├── modules/
│   └── auth/      → Schema, service, controller, routes
├── prisma/        → Client Prisma singleton
└── types/         → Types TypeScript globaux
```
