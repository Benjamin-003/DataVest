import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordPayload,
  CheckEmailPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  TokenPair,
  TwoFactorPayload,
  UpdateProfilePayload,
  User,
} from '../models/auth.models';

const BASE = `${environment.apiUrl}/auth`;

/**
 * Couche HTTP pure — aucun état, aucun Signal.
 * Chaque méthode retourne un Observable que AuthService consomme.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);

  // ─── Routes publiques ──────────────────────────────────────────────────────

  /** Étape 1 du login : vérifie les credentials, déclenche l'envoi du code 2FA */
  login(payload: LoginPayload) {
    return this.http.post<LoginResponse>(`${BASE}/login`, payload);
  }

  /** Étape 2 du login : valide le code 2FA, retourne les tokens */
  verifyTwoFactor(payload: TwoFactorPayload) {
    return this.http.post<AuthResponse>(`${BASE}/2fa/verify`, payload);
  }

  /** Crée un compte et retourne les tokens */
  register(payload: RegisterPayload) {
    return this.http.post<RegisterResponse>(`${BASE}/register`, payload);
  }

  /** Vérifie si un email est déjà utilisé.
   *  200 = email pris, 404 = email disponible */
  checkEmail(payload: CheckEmailPayload) {
    return this.http.post<void>(`${BASE}/check-email`, payload, {
      observe: 'response',
    });
  }

  /** Demande un lien de réinitialisation de mot de passe (toujours 200) */
  forgotPassword(payload: ForgotPasswordPayload) {
    return this.http.post<{ message: string }>(`${BASE}/forgot-password`, payload);
  }

  /** Réinitialise le mot de passe via le token reçu par email */
  resetPassword(payload: ResetPasswordPayload) {
    return this.http.post<void>(`${BASE}/reset-password`, payload);
  }

  /** Vérifie l'adresse email via le token reçu par email */
  verifyEmail(token: string) {
    return this.http.post<{ message: string }>(`${BASE}/verify-email`, { token });
  }

  /** Rafraîchit la paire de tokens (appelé par l'intercepteur) */
  refresh(refreshToken: string) {
    return this.http.post<TokenPair>(`${BASE}/refresh`, { refreshToken });
  }

  // ─── Routes protégées (Bearer token requis via intercepteur) ───────────────

  /** Retourne le profil de l'utilisateur connecté */
  getMe() {
    return this.http.get<User>(`${BASE}/me`);
  }

  /** Met à jour le profil (tous les champs sont optionnels) */
  updateMe(payload: UpdateProfilePayload) {
    return this.http.patch<User>(`${BASE}/me`, payload);
  }

  /** Change le mot de passe de l'utilisateur connecté */
  changePassword(payload: ChangePasswordPayload) {
    return this.http.patch<void>(`${BASE}/password`, payload);
  }

  /** Déconnecte l'utilisateur (invalide le refresh token côté serveur) */
  logout() {
    return this.http.post<void>(`${BASE}/logout`, {});
  }

  /** Supprime définitivement le compte */
  deleteMe() {
    return this.http.delete<void>(`${BASE}/me`);
  }

  exportMe() {
    return this.http.get(`${BASE}/me/export`);
}

resendVerificationEmail(email: string) {
  return this.http.post<{ message: string }>(`${BASE}/resend-verification-email`, { email });
}
}