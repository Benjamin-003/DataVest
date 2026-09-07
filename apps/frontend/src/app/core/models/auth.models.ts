// ─── Modèles alignés sur les réponses du backend ───────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
  // Informations personnelles (Ottawa-Pigeon)
  birthdate: string | null;
  address: string | null;
  zipcode: string | null;
  city: string | null;
  country: string | null;
  newsletter: boolean;
  // Préférences
  languageCode: string | null;
  currencyCode: string | null;
  subscriptionCode: string | null;
  createdAt: string;
}

// POST /api/auth/login → { twoFactorRequired: true }
export interface LoginResponse {
  twoFactorRequired: true;
}

// POST /api/auth/2fa/verify → { user, accessToken, refreshToken }
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// POST /api/auth/refresh → { accessToken, refreshToken }
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// POST /api/auth/register → { user, accessToken, refreshToken }
export type RegisterResponse = AuthResponse;

// ─── Payloads de requête ─────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TwoFactorPayload {
  email: string;
  code: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthdate?: string;    // ISO string
  address?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  newsletter?: boolean;
  subscriptionCode?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthdate?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  newsletter?: boolean;
  languageCode?: string;
  currencyCode?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface CheckEmailPayload {
  email: string;
}