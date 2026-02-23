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
