# API Routes

Base URL : `http://localhost:3000`

---

## Routes publiques

### `POST /api/auth/register`

**Body :**
```json
{
  "email": "test@test.com",
  "password": "MonMotDePasse123!",
  "firstName": "John",
  "lastName": "Doe"
}
```
> `firstName` et `lastName` sont optionnels.

**Retour 201 :**
```json
{
  "user": {
    "id": "cmlv2l3c80000ik7khuj71g24",
    "email": "test@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2026-02-20T15:53:53.960Z"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```
> Un email de vérification est automatiquement envoyé après l'inscription.

---

### `POST /api/auth/login`

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
> La 2FA est obligatoire. Un code à 6 chiffres valable **5 minutes** est envoyé par email. Les tokens JWT ne sont retournés qu'après vérification du code via `/api/auth/2fa/verify`.

---

### `POST /api/auth/2fa/verify`

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
  "user": {
    "id": "cmlv2l3c80000ik7khuj71g24",
    "email": "test@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2026-02-20T15:53:53.960Z"
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### `POST /api/auth/refresh`

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

### `POST /api/auth/check-email`

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

### `POST /api/auth/forgot-password`

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
> Retourne toujours 200 même si l'email n'existe pas.
> Lien valide **1 heure**.

---

### `POST /api/auth/reset-password`

**Body :**
```json
{
  "token": "le_token_reçu_par_email",
  "newPassword": "NouveauMotDePasse123!"
}
```

**Retour 204 :** aucun contenu

---

### `POST /api/auth/verify-email`

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

## Routes protégées 🔒

> Header requis :
> ```
> Authorization: Bearer <accessToken>
> ```

---

### `GET /api/auth/me`

**Body :** aucun

**Retour 200 :**
```json
{
  "id": "cmlv2l3c80000ik7khuj71g24",
  "email": "test@test.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "createdAt": "2026-02-20T15:53:53.960Z"
}
```

---

### `PATCH /api/auth/me`

> Tous les champs sont optionnels.

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "nouveau@test.com",
  "password": "NouveauMotDePasse123!"
}
```

**Retour 200 :**
```json
{
  "id": "cmlv2l3c80000ik7khuj71g24",
  "email": "nouveau@test.com",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "USER",
  "createdAt": "2026-02-20T15:53:53.960Z"
}
```

---

### `PATCH /api/auth/password`

**Body :**
```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse123!"
}
```

**Retour 204 :** aucun contenu

---

### `POST /api/auth/logout`

**Body :** aucun

**Retour 204 :** aucun contenu

---

### `DELETE /api/auth/me`

**Body :** aucun

**Retour 204 :** aucun contenu

---

## Flux d'authentification complet

```
1. POST /login
   → { twoFactorRequired: true }
   → Email avec code à 6 chiffres (valable 5 min)

2. POST /2fa/verify avec le code
   → { user, accessToken, refreshToken }

3. Requêtes protégées
   → Authorization: Bearer accessToken

4. Access token expiré → 401
   → POST /refresh
   → nouveaux tokens

5. Refresh token expiré → 401
   → redirection /login
```

---

## Erreurs

### Validation (422)
```json
{
  "errors": [
    { "field": "email", "message": "Adresse email invalide" },
    { "field": "password", "message": "Le mot de passe doit faire au moins 12 caractères" }
  ]
}
```

### Erreur métier
```json
{
  "message": "Identifiants invalides"
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
| Caractère spécial | Au moins un caractère spécial |

**Exemples :**
- ❌ `simple` — trop court
- ❌ `monmotdepasse` — pas de majuscule, chiffre ou caractère spécial
- ✅ `MonMotDePasse123!` — valide