# Ottawa Pigeon — Frontend

Application web de suivi de portefeuille financier développée avec **Angular 19**.

---

## Stack technique

| Outil | Version | Rôle |
|---|---|---|
| Angular | 19.x | Framework frontend |
| TypeScript | 5.x | Typage statique |
| PrimeNG | 19.x | Bibliothèque de composants UI |
| PrimeFlex | 3.x | Utilitaires CSS |
| RxJS | 7.x | Programmation réactive |
| Angular i18n | — | Internationalisation (FR / EN) |

---

## Prérequis

- Node.js 18+
- Angular CLI : `npm install -g @angular/cli`

---

## Installation et démarrage

```bash
# Installer les dépendances
npm install

# Lancer en développement
ng serve

# L'application est accessible sur http://localhost:4200
```

> Le backend doit être lancé sur `http://localhost:3000` pour que l'application fonctionne.

---

## Build

```bash
ng build
# Output dans le dossier dist/
```

---

## Structure des fichiers

```
src/
├── app/
│   ├── authentification/         # Inscription, connexion, 2FA, reset mot de passe
│   │   └── pages/
│   │       ├── connexion/
│   │       ├── form-inscription/
│   │       ├── preambule-inscription/
│   │       ├── reinitialisation-mdp/
│   │       ├── reset-password/
│   │       ├── two-factor/
│   │       └── verify-email/
│   ├── core/                     # Services transverses
│   │   ├── auth/
│   │   │   ├── auth.api.ts       # Appels HTTP vers le backend
│   │   │   ├── auth.guard.ts     # Protection des routes
│   │   │   └── auth.service.ts   # Logique métier auth + état utilisateur
│   │   ├── interceptors/         # Intercepteur JWT (refresh automatique)
│   │   └── models/               # Interfaces TypeScript
│   ├── information-societe/      # Pages À propos, Contact
│   ├── investissement/           # Pages Investir, Watchlist, Portfolio
│   ├── legal/                    # Pages légales RGPD
│   │   ├── mentions-legales/
│   │   └── politique-confidentialite/
│   ├── shared/                   # Composants et pipes réutilisables
│   ├── tarif/                    # Page Tarifs
│   └── user-settings/            # Paramètres utilisateur
│       └── components/
│           ├── account-data/     # Suppression compte + export RGPD
│           ├── credentials/      # Email & mot de passe
│           ├── other-settings/   # Langue, devise, newsletter
│           └── personal-data/    # Informations personnelles
├── assets/
└── environments/
```

---

## Routes

| Route | Accès | Description |
|---|---|---|
| `/authentication/connexion` | Public | Connexion |
| `/authentication/two-factor` | Public | Vérification code 2FA |
| `/authentication/preambule-inscription` | Public | Choix abonnement |
| `/authentication/form-inscription` | Public | Formulaire inscription |
| `/authentication/reinitialisation-mdp` | Public | Demande reset mot de passe |
| `/authentication/reset-password` | Public | Nouveau mot de passe |
| `/authentication/verify-email` | Public | Vérification email |
| `/legal/politique-confidentialite` | Public | Politique de confidentialité (RGPD) |
| `/legal/mentions-legales` | Public | Mentions légales |
| `/accueil` | Protégé 🔒 | Page d'accueil |
| `/investissement` | Protégé 🔒 | Watchlist & Portfolio |
| `/tarif` | Protégé 🔒 | Tarifs |
| `/information-societe` | Protégé 🔒 | À propos |
| `/parametres` | Protégé 🔒 | Paramètres utilisateur |

---

## Couche service

### `auth.api.ts`
Appels HTTP vers le backend :
- `login`, `verifyTwoFactor`, `register`, `logout`, `refresh`
- `getMe`, `updateMe`, `deleteMe`
- `exportMe` — export RGPD des données au format JSON (Art. 20)
- `changePassword`, `forgotPassword`, `resetPassword`
- `verifyEmail`, `checkEmail`

### `auth.service.ts`
- Gère l'état de l'utilisateur via un **Signal Angular** (`user`)
- Stocke les tokens en **sessionStorage** (supprimés à la fermeture de l'onglet)
- Gère le téléchargement automatique du fichier JSON lors de l'export RGPD

### Intercepteur JWT
Injecte automatiquement le `Bearer token` sur chaque requête.
Sur les erreurs 401, tente un refresh token puis rejoue la requête originale.
Si le refresh échoue, redirige vers `/authentication/connexion`.

---

## Conformité RGPD

| Droit | Article | Implémentation |
|---|---|---|
| Information | Art. 13 | `/legal/politique-confidentialite` |
| Rectification | Art. 16 | Page Paramètres → Données personnelles |
| Effacement | Art. 17 | Page Paramètres → Supprimer mon compte |
| Portabilité | Art. 20 | Page Paramètres → Exporter mes données |
| Consentement newsletter | Art. 6.1.a | Case explicite à l'inscription + gestion dans Paramètres |
| Minimisation des données | Art. 5 | Adresse et date de naissance optionnelles à l'inscription |

---

## Variables d'environnement

L'URL du backend est configurée dans `src/environments/` :

```typescript
// environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```