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
> Retourne toujours 200 même si l'email n'existe pas, pour ne pas révéler si un compte existe.
> Un email avec un lien valide **1 heure** est envoyé si le compte existe.

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
> Le token de vérification est valide **24 heures**.

---

## Routes protégées 🔒

> Header requis sur toutes ces routes :
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

> Tous les champs sont optionnels — envoyez uniquement ce que vous souhaitez modifier.

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

## Erreurs

### Format d'une erreur de validation (422)
```json
{
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Adresse email invalide" },
    { "field": "password", "message": "Le mot de passe doit faire au moins 12 caractères" }
  ]
}
```

### Format d'une erreur métier
```json
{
  "message": "Email déjà utilisé"
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
| Caractère spécial | Au moins un caractère spécial (ex: `!`, `@`, `#`, `$`) |

**Exemples :**
- ❌ `simple` — trop court, pas de majuscule ni chiffre
- ❌ `monmotdepasse` — pas de majuscule, chiffre ou caractère spécial
- ✅ `MonMotDePasse123!` — valide