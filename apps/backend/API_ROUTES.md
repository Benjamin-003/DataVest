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