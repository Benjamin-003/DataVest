# Architecture du projet Backend

## Structure des fichiers

```
Backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   └── auth/
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
C'est ici qu'on définit les modèles (tables), les champs et les relations.
Prisma lit ce fichier pour générer les migrations SQL et le client TypeScript.

### `prisma.config.ts`
Fichier de configuration propre à Prisma v7.
Indique à Prisma où se trouve le schéma, les migrations, et comment se connecter à la base via `DATABASE_URL`.

---

## Configuration

### `src/config/env.ts`
Charge et valide toutes les variables d'environnement au démarrage du serveur.
Si une variable obligatoire est manquante, le serveur refuse de démarrer avec un message d'erreur clair.
Exporte un objet `config` structuré et typé, utilisé dans tout le projet à la place de `process.env`.

---

## Types TypeScript

### `src/types/env.d.ts`
Déclare à TypeScript quelles variables existent dans `process.env`.
Grâce à ce fichier, TypeScript connaît le type de chaque variable d'environnement et vous avez l'autocomplétion dans VS Code.

### `src/types/express.d.ts`
Étend le type `Request` d'Express pour y ajouter la propriété `user`.
Sans ce fichier, TypeScript ne saurait pas que `req.user` existe et afficherait une erreur à chaque utilisation.

---

## Prisma Client

### `src/prisma/client.ts`
Crée et exporte une seule instance de `PrismaClient` partagée dans toute l'application.
Utilise l'adapter `@prisma/adapter-pg` requis par Prisma v7 pour se connecter directement à PostgreSQL.
Sans ce singleton, chaque fichier qui importe Prisma créerait une nouvelle connexion à la base de données, ce qui peut rapidement la saturer.

---

## Middlewares

Les middlewares sont des fonctions qui s'exécutent **entre** la réception d'une requête et son traitement par le contrôleur.
Ils sont séparés des modules car ils sont **transversaux** — ils servent à toute l'application, pas à une seule fonctionnalité.

### `src/middleware/error.middleware.ts`
Intercepte toutes les erreurs de l'application et retourne une réponse JSON propre au client.
Gère trois cas :
- **Erreur Zod (422)** : données invalides envoyées par le client
- **Erreur métier AppError** : erreur volontaire avec un code HTTP (ex: 401, 404, 409)
- **Erreur inattendue (500)** : bug ou crash non prévu

Ce middleware doit toujours être déclaré **en dernier** dans `app.ts`.

### `src/middleware/validate.middleware.ts`
Valide les données d'une requête HTTP en utilisant un schéma Zod passé en paramètre.
Si les données sont invalides (ex: email mal formaté, mot de passe trop faible), il retourne immédiatement une erreur 422 sans aller jusqu'au contrôleur.

### `src/middleware/auth.middleware.ts`
Contient deux fonctions :
- **`authenticate`** : vérifie que l'utilisateur est connecté en lisant et validant son token JWT. Si le token est valide, ajoute les infos de l'utilisateur dans `req.user`.
- **`authorize(...roles)`** : vérifie que l'utilisateur a le bon rôle pour accéder à une route. S'utilise toujours après `authenticate`.

---

## Modules

Un module regroupe tous les fichiers liés à une même fonctionnalité. Cela permet d'organiser le code **par fonctionnalité** plutôt que par type de fichier. Pour ajouter une nouvelle fonctionnalité, il suffit de créer un nouveau dossier dans `modules/`.

### `src/modules/auth/auth.schema.ts`
Définit les règles de validation Zod pour chaque route d'authentification.

Règles de validation du mot de passe :
- Minimum **12 caractères**
- Au moins **une majuscule**
- Au moins **une minuscule**
- Au moins **un chiffre**
- Au moins **un caractère spécial**

La règle `passwordValidation` est définie une seule fois et réutilisée dans tous les schémas pour éviter la duplication.
Exporte aussi les types TypeScript générés automatiquement par Zod.

### `src/modules/auth/auth.service.ts`
Contient toute la logique métier de l'authentification, découpée en petites fonctions avec un rôle précis :
- **`register`** : vérifie que l'email n'existe pas, hash le mot de passe, crée l'utilisateur
- **`login`** : vérifie l'email et le mot de passe, retourne les tokens
- **`refresh`** : vérifie le refresh token et retourne une nouvelle paire de tokens
- **`logout`** : supprime le refresh token en base pour l'invalider
- **`getLoggedUser`** : récupère le profil de l'utilisateur connecté
- **`updateMe`** : met à jour partiellement le profil
- **`deleteMe`** : supprime le compte
- **`checkEmail`** : vérifie si un email existe en base
- **`changePassword`** : vérifie l'ancien mot de passe et sauvegarde le nouveau hashé

### `src/modules/auth/auth.controller.ts`
Fait le lien entre les routes et le service.
Reçoit la requête HTTP, appelle le service et renvoie la réponse.
Ne contient aucune logique métier, uniquement de la gestion req/res.

### `src/modules/auth/auth.routes.ts`
Définit les points d'entrée de l'API d'authentification.

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Créer un compte |
| POST | `/api/auth/login` | Public | Se connecter |
| POST | `/api/auth/refresh` | Public | Renouveler le token |
| POST | `/api/auth/check-email` | Public | Vérifier si un email existe |
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
| @prisma/adapter-pg | - | Adapter PostgreSQL pour Prisma v7 |