import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthApiService } from './auth.api';
import {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  TwoFactorPayload,
  UpdateProfilePayload,
  User,
} from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Service d'état de l'authentification.
 *
 * Responsabilités :
 * - Maintenir l'état de l'utilisateur connecté via Signals
 * - Stocker / lire / supprimer les tokens en sessionStorage
 * - Exposer les méthodes métier (login, logout, register…)
 * - Déléguer tous les appels HTTP à AuthApiService
 *
 * Pattern :
 *   _user       → signal privé en écriture
 *   user        → signal public en lecture seule (computed)
 *   isLoggedIn  → computed depuis user
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly router = inject(Router);

  // ─── État interne ──────────────────────────────────────────────────────────

  /** Signal privé modifiable — uniquement écrit par ce service */
  private readonly _user = signal<User | null>(null);

  /** Signal privé pour stocker temporairement l'email entre login et 2FA */
  private readonly _pendingEmail = signal<string | null>(null);

  // ─── Signaux publics ───────────────────────────────────────────────────────

  /** Profil de l'utilisateur connecté (null si non connecté) */
  readonly user = this._user.asReadonly();

  /** true si un utilisateur est connecté */
  readonly isLoggedIn = computed(() => this._user() !== null);

  /** Email en attente de validation 2FA */
  readonly pendingEmail = this._pendingEmail.asReadonly();

  // ─── Gestion des tokens ────────────────────────────────────────────────────

  get accessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearTokens(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  // ─── Initialisation au démarrage ───────────────────────────────────────────

  /**
   * Appelé dans app.config.ts via APP_INITIALIZER.
   * Tente de récupérer le profil si un token existe déjà en session.
   */
  init(): Promise<void> {
    if (!this.accessToken) return Promise.resolve();
    return new Promise((resolve) => {
      this.api.getMe().subscribe({
        next: (user) => {
          this._user.set(user);
          resolve();
        },
        error: () => {
          // Token expiré ou invalide — l'intercepteur tentera le refresh.
          // Si le refresh échoue aussi, l'intercepteur redirige vers /login.
          this.clearTokens();
          resolve();
        },
      });
    });
  }

  // ─── Flux de connexion (login → 2FA) ──────────────────────────────────────

  /**
   * Étape 1 : vérifie les credentials.
   * En cas de succès, stocke l'email et retourne { twoFactorRequired: true }.
   * Le composant doit ensuite rediriger vers /authentication/2fa.
   */
  login(payload: LoginPayload) {
    return this.api.login(payload).pipe(
      tap(() => this._pendingEmail.set(payload.email))
    );
  }

  /**
   * Étape 2 : valide le code 2FA.
   * Met à jour l'état utilisateur et les tokens en session.
   */
  verifyTwoFactor(payload: TwoFactorPayload) {
    return this.api.verifyTwoFactor(payload).pipe(
      tap(({ user, accessToken, refreshToken }) => {
        this._user.set(user);
        this._pendingEmail.set(null);
        this.saveTokens(accessToken, refreshToken);
      })
    );
  }

  // ─── Inscription ───────────────────────────────────────────────────────────

  register(payload: RegisterPayload) {
    return this.api.register(payload).pipe(
      tap(({ user, accessToken, refreshToken }) => {
        this._user.set(user);
        this.saveTokens(accessToken, refreshToken);
      })
    );
  }

  // ─── Déconnexion ───────────────────────────────────────────────────────────

  logout() {
    return this.api.logout().pipe(
      tap({
        // Nettoyage local que la requête réussisse ou non
        next:  () => this.clearSession(),
        error: () => this.clearSession(),
      })
    );
  }

  /** Appelé par l'intercepteur si le refresh token est expiré */
  forceLogout(): void {
    this.clearSession();
    this.router.navigate(['/authentication/connexion']);
  }

  private clearSession(): void {
    this._user.set(null);
    this._pendingEmail.set(null);
    this.clearTokens();
  }

  // ─── Profil ────────────────────────────────────────────────────────────────

  getMe() {
    return this.api.getMe().pipe(
      tap((user) => this._user.set(user))
    );
  }

  updateMe(payload: UpdateProfilePayload) {
    return this.api.updateMe(payload).pipe(
      tap((user) => this._user.set(user))
    );
  }

  changePassword(payload: ChangePasswordPayload) {
    return this.api.changePassword(payload);
  }

  deleteMe() {
    return this.api.deleteMe().pipe(
      tap(() => this.clearSession())
    );
  }

  // ─── Mot de passe oublié ───────────────────────────────────────────────────

  forgotPassword(payload: ForgotPasswordPayload) {
    return this.api.forgotPassword(payload);
  }

  resetPassword(payload: ResetPasswordPayload) {
    return this.api.resetPassword(payload);
  }

  // ─── Vérification email / disponibilité ────────────────────────────────────

  verifyEmail(token: string) {
    return this.api.verifyEmail(token);
  }

  /**
   * Vérifie la disponibilité d'un email.
   * Retourne true si l'email est DÉJÀ utilisé (status 200),
   * false s'il est disponible (status 404).
   */
  isEmailTaken(email: string) {
    return this.api.checkEmail({ email });
  }
}