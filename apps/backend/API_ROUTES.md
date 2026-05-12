# API Routes

Base URL : `http://localhost:3000`

> Frontend autorisé : `http://localhost:4200` (CORS configuré dans `.env` via `CORS_ORIGIN`)

---

## Santé du serveur

### `GET /health`

**Retour 200 :**
```json
{
  "status": "ok",
  "timestamp": "2026-04-28T10:00:00.000Z"
}
```

---

## Authentification

### Routes publiques

#### `POST /api/auth/register`

Crée un compte utilisateur. Un email de vérification est automatiquement envoyé.

**Body :**
```json
{
  "email": "test@test.com",
  "password": "MonMotDePasse123!",
  "firstName": "John",
  "lastName": "Doe",
  "birthdate": "1990-01-15T00:00:00.000Z",
  "address": "12 rue de la Paix",
  "zipcode": "75001",
  "city": "Paris",
  "country": "France",
  "newsletter": false,
  "subscriptionCode": "FREE"
}
```
> Seuls `email` et `password` sont obligatoires.

**Retour 201 :**
```json
{
  "user": {
    "id": "cmlv2l3c80000ik7khuj71g24",
    "email": "test@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "birthdate": "1990-01-15T00:00:00.000Z",
    "address": "12 rue de la Paix",
    "zipcode": "75001",
    "city": "Paris",
    "country": "France",
    "newsletter": false,
    "languageCode": null,
    "currencyCode": null,
    "subscriptionCode": "FREE",
    "createdAt": "2026-04-28T10:00:00.000Z"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

#### `POST /api/auth/login`

Étape 1 du flow de connexion. Vérifie les credentials et envoie un code 2FA par email.

**Body :**
```json
{
  "email": "test@test.com",
  "password": "MonMotDePasse123!"
}
```

**Retour 200 :**
```json
{
  "twoFactorRequired": true
}
```
> La 2FA est obligatoire. Un code à 6 chiffres valable **5 minutes** est envoyé par email.

---

#### `POST /api/auth/2fa/verify`

Étape 2 du flow de connexion. Valide le code 2FA et retourne les tokens JWT.

**Body :**
```json
{
  "email": "test@test.com",
  "code": "123456"
}
```

**Retour 200 :**
```json
{
  "user": { ... },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

#### `POST /api/auth/refresh`

Renouvelle la paire de tokens. L'intercepteur HTTP du frontend appelle cette route automatiquement sur les 401.

**Body :**
```json
{
  "refreshToken": "..."
}
```

**Retour 200 :**
```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

#### `POST /api/auth/check-email`

Vérifie si un email est déjà utilisé. Utilisé par le validateur asynchrone du formulaire d'inscription.

**Body :**
```json
{
  "email": "test@test.com"
}
```

**Retours :**
| Status | Signification |
|---|---|
| 200 | Email trouvé → déjà utilisé |
| 404 | Email absent → disponible |

---

#### `POST /api/auth/forgot-password`

Envoie un email de réinitialisation si le compte existe. Retourne toujours 200 (sécurité — ne révèle pas l'existence du compte).

**Body :**
```json
{
  "email": "test@test.com"
}
```

**Retour 200 :**
```json
{
  "message": "If this email exists, a reset link has been sent"
}
```
> Lien valide **1 heure**.

---

#### `POST /api/auth/reset-password`

Réinitialise le mot de passe via le token reçu par email.

**Body :**
```json
{
  "token": "le_token_reçu_par_email",
  "newPassword": "NouveauMotDePasse123!"
}
```

**Retour 204 :** aucun contenu

---

#### `POST /api/auth/verify-email`

Valide l'adresse email via le token reçu à l'inscription.

**Body :**
```json
{
  "token": "le_token_reçu_par_email"
}
```

**Retour 200 :**
```json
{
  "message": "Email verified successfully"
}
```
> Token valide **24 heures**.

---

### Routes protégées 🔒

> Header requis sur toutes les routes protégées :
> ```
> Authorization: Bearer <accessToken>
> ```

---

#### `GET /api/auth/me`

Retourne le profil complet de l'utilisateur connecté.

**Retour 200 :**
```json
{
  "id": "cmlv2l3c80000ik7khuj71g24",
  "email": "test@test.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "birthdate": "1990-01-15T00:00:00.000Z",
  "address": "12 rue de la Paix",
  "zipcode": "75001",
  "city": "Paris",
  "country": "France",
  "newsletter": false,
  "languageCode": "FR",
  "currencyCode": "EUR",
  "subscriptionCode": "FREE",
  "createdAt": "2026-04-28T10:00:00.000Z"
}
```

---

#### `PATCH /api/auth/me`

Met à jour le profil. Tous les champs sont optionnels.

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "nouveau@test.com",
  "birthdate": "1990-06-20T00:00:00.000Z",
  "address": "5 avenue Montaigne",
  "zipcode": "75008",
  "city": "Paris",
  "country": "France",
  "newsletter": true,
  "languageCode": "EN",
  "currencyCode": "USD"
}
```

**Retour 200 :** profil mis à jour (même format que `GET /api/auth/me`)

---

#### `PATCH /api/auth/password`

Change le mot de passe de l'utilisateur connecté.

**Body :**
```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse123!"
}
```

**Retour 204 :** aucun contenu

---

#### `POST /api/auth/logout`

Invalide le refresh token côté serveur.

**Body :** aucun

**Retour 204 :** aucun contenu

---

#### `DELETE /api/auth/me`

Supprime définitivement le compte de l'utilisateur connecté.

**Body :** aucun

**Retour 204 :** aucun contenu

---

## Données de référence (publiques)

### `GET /api/currencies`

**Retour 200 :**
```json
[
  { "code": "EUR", "label": "Euro",      "flag": "eu" },
  { "code": "USD", "label": "US Dollar", "flag": "us" }
]
```

---

### `GET /api/languages`

**Retour 200 :**
```json
[
  { "code": "FR", "label": "Français" },
  { "code": "EN", "label": "English"  }
]
```

---

### `GET /api/subscriptions`

**Retour 200 :**
```json
[
  { "code": "FREE",    "label": "Gratuit", "isDefault": true  },
  { "code": "BASIC",   "label": "Basic",   "isDefault": false },
  { "code": "PREMIUM", "label": "Premium", "isDefault": false }
]
```

---

## Flux RSS (protégé) 🔒

### `GET /api/articles/:url`

Proxy vers un flux RSS externe. L'URL du flux doit être **encodée en base64** (le frontend utilise `btoa(url)`).

**Params :** `:url` — URL du flux RSS encodée en base64

**Exemple :**
```
btoa('https://www.ft.com/rss/home')
→ 'aHR0cHM6Ly93d3cuZnQuY29tL3Jzcy9ob21l'
GET /api/articles/aHR0cHM6Ly93d3cuZnQuY29tL3Jzcy9ob21l
```

**Retour 200 :** contenu XML brut du flux RSS (Content-Type: text/xml)

**Retour 404 :** flux inaccessible ou URL invalide

---

## Flux d'authentification complet

```
1. POST /api/auth/login
   → { twoFactorRequired: true }
   → Email avec code à 6 chiffres (valable 5 min)

2. POST /api/auth/2fa/verify
   → { user, accessToken, refreshToken }

3. Requêtes protégées
   → Authorization: Bearer accessToken

4. Access token expiré → 401
   → POST /api/auth/refresh → nouveaux tokens (géré automatiquement par l'intercepteur)

5. Refresh token expiré → 401
   → Déconnexion + redirection /authentication/connexion
```

---

## Erreurs

### Validation (422)
```json
{
  "errors": [
    { "field": "email",    "message": "Adresse email invalide" },
    { "field": "password", "message": "Le mot de passe doit faire au moins 12 caractères" }
  ]
}
```

### Erreur métier (4xx)
```json
{
  "message": "Identifiants invalides"
}
```

### Erreur serveur (500)
```json
{
  "message": "Internal server error"
}
```

---

## Watchlist (protégé) 🔒

### `GET /api/watchlist`

Retourne tous les actifs surveillés par l'utilisateur connecté.

**Retour 200 :**
```json
[
  {
    "id": "cmlv2l3c80000ik7khuj71g24",
    "userId": "...",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "type": "STOCK",
    "createdAt": "2026-04-28T10:00:00.000Z"
  }
]
```

---

### `POST /api/watchlist`

Ajoute un actif à la watchlist.

**Body :**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "type": "STOCK"
}
```

> Types acceptés : `STOCK`, `CRYPTO`, `COMMODITY`, `INDEX`, `FOREX`
> Le symbole est automatiquement converti en majuscules.
> Retourne 409 si le symbole est déjà dans la watchlist.

**Retour 201 :** item créé

---

### `DELETE /api/watchlist/:id`

Supprime un actif de la watchlist.

**Retour 204 :** aucun contenu
> Retourne 404 si l'item n'existe pas ou n'appartient pas à l'utilisateur.

---

## Portfolio (protégé) 🔒

### `GET /api/portfolio`

Retourne toutes les positions avec les prix actuels (Yahoo Finance) et le calcul du P&L.

**Retour 200 :**
```json
[
  {
    "id": "cmlv2l3c80000ik7khuj71g24",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "quantity": 10,
    "buyPrice": 150.00,
    "currentPrice": 287.51,
    "value": 2875.10,
    "cost": 1500.00,
    "pnl": 1375.10,
    "pnlPercent": 91.67,
    "createdAt": "2026-04-28T10:00:00.000Z"
  }
]
```
> `currentPrice`, `value`, `pnl` et `pnlPercent` sont `null` si le prix est indisponible.

---

### `POST /api/portfolio`

Ajoute une position au portfolio.

**Body :**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "quantity": 10,
  "buyPrice": 150.00
}
```

**Retour 201 :** position créée (sans prix actuel)

---

### `DELETE /api/portfolio/:id`

Supprime une position du portfolio.

**Retour 204 :** aucun contenu
> Retourne 404 si la position n'existe pas ou n'appartient pas à l'utilisateur.

---

## Historique des cours (protégé) 🔒

### `GET /api/prices/:symbol?range=1mo`

Retourne l'historique des prix d'un actif via Yahoo Finance.

**Params :** `:symbol` — symbole de l'actif (ex: `AAPL`, `ETH-USD`)

**Query :** `range` — période :

| Valeur | Description | Intervalle |
|---|---|---|
| `1d` | 1 jour | 5 minutes |
| `5d` | 1 semaine (5 jours de trading) | 1 heure |
| `1mo` | 1 mois | 1 jour |
| `1y` | 1 an | 1 semaine |

**Retour 200 :**
```json
[
  { "timestamp": 1714298400000, "price": 284.12 },
  { "timestamp": 1714302000000, "price": 285.50 }
]
```
> `timestamp` est en millisecondes (Unix timestamp × 1000).
> Retourne 404 si le symbole est introuvable sur Yahoo Finance.

---

## Règles de validation du mot de passe

| Règle | Détail |
|---|---|
| Longueur | Minimum 12 caractères |
| Majuscule | Au moins une lettre majuscule |
| Minuscule | Au moins une lettre minuscule |
| Chiffre | Au moins un chiffre |
| Caractère spécial | Au moins un caractère spécial (`!`, `@`, `#`, etc.) |

**Exemples :**
- ❌ `simple` — trop court
- ❌ `monmotdepasse` — pas de majuscule, chiffre ou caractère spécial
- ✅ `MonMotDePasse123!` — valide