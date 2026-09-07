# DataVest

Application fintech développée dans le cadre d'un titre professionnel (Alt Incubateur Tech, janvier–juin 2026).

Monorepo géré avec [Nx](https://nx.dev), regroupant le frontend Angular et l'API backend Express.

## Stack technique

| Partie | Technologies |
|--------|-------------|
| **Frontend** | Angular 19, PrimeNG 19, RxJS, Signals, Cypress (E2E) |
| **Backend**  | Node.js, Express, TypeScript, Prisma, PostgreSQL 16 |
| **Monorepo** | Nx (workspace, cache, orchestration des tâches) |
| **Base de données** | PostgreSQL via Docker |

## Structure du projet

```
DataVest-nx/
├── apps/
│   ├── frontend/     Application Angular (PrimeNG, Signals)
│   └── backend/      API Express + Prisma + PostgreSQL
├── nx.json            Configuration Nx (plugins, cache)
├── package.json        Scripts racine (dev, build...)
└── README.md
```

## Fonctionnalités principales

- Authentification complète : inscription, connexion, double authentification (2FA), vérification d'email, réinitialisation de mot de passe
- Dashboard avec cotations en temps réel
- Watchlist et gestion de portefeuille (portfolio)
- Actualités financières et ISR (Investissement Socialement Responsable)
- Paramètres utilisateur et gestion d'abonnement (tarifs)
- Export RGPD des données personnelles

## Prérequis

- Node.js 18+
- Docker (pour PostgreSQL)
- npm

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/Benjamin-003/DataVest.git
cd DataVest
```

### 2. Installer les dépendances

```bash
npm install --prefix apps/frontend
npm install --prefix apps/backend
```

### 3. Lancer la base de données PostgreSQL (Docker)

```bash
cd apps/backend
docker-compose up -d
cd ../..
```

### 4. Configurer les variables d'environnement du backend

Crée un fichier `apps/backend/.env` avec :

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5433/mydb?schema=public"
JWT_SECRET="ton_secret_ici"
JWT_REFRESH_SECRET="ton_autre_secret_ici"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
RESEND_API_KEY="ta_cle_resend"
```

> Génère des secrets JWT aléatoires avec :
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 5. Générer le client Prisma et appliquer les migrations

```bash
npx nx run backend:prisma-generate
npx nx run backend:prisma-migrate
```

## Lancer le projet

### Les deux applications en parallèle

```bash
npm run dev
```

- Frontend : http://localhost:4200
- Backend : http://localhost:3000

### Une application à la fois

```bash
npm run dev:front   # Angular seul
npm run dev:back    # Express seul
```

## Build de production

```bash
npm run build
```

## Autres commandes utiles

| Commande | Effet |
|----------|-------|
| `npx nx graph` | Visualise le graphe de dépendances du workspace |
| `npx nx run backend:prisma-studio` | Ouvre l'interface graphique Prisma Studio |
| `npx nx run backend:seed` | Peuple la base avec des données initiales |
| `npx nx run-many --target=test --all` | Lance tous les tests du workspace |
| `npx nx reset` | Vide le cache Nx (en cas de comportement incohérent) |

## Tests

- **Backend** : Vitest (`npx nx run backend:test`)
- **Frontend** : Karma/Jasmine (`npx nx test frontend`) et Cypress pour les tests E2E (`npx nx run frontend:e2e`)

## Sécurité

Le projet applique les recommandations OWASP Top 10 : validation des entrées (Zod), hachage bcrypt des mots de passe, tokens JWT à courte durée avec refresh révocable, protection contre les attaques IDOR, et conformité RGPD (export et suppression des données personnelles).

## Auteur

Benjamin Boissin — Titre professionnel Concepteur Développeur d'Applications, Alt Incubateur Tech (2026)