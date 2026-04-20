import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Remplace AuthentificationGuard.
 * Redirige vers /authentication/connexion si l'utilisateur n'est pas connecté.
 *
 * Avant (Angular 14) :
 *   @Injectable() export class AuthentificationGuard implements CanActivate { ... }
 *
 * Après (Angular 15+) :
 *   export const authGuard: CanActivateFn = () => ...
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/authentication/connexion']);
};

/**
 * Remplace ResetPasswordGuard.
 * Vérifie que l'URL contient bien un token de reset password valide (non vide).
 * La validation réelle (expiration) est faite côté backend au moment du submit.
 */
export const resetPasswordGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const token = route.paramMap.get('token');

  if (token && token.length > 0) {
    return true;
  }

  return router.createUrlTree(['/authentication/password']);
};

/**
 * Guard pour la page 2FA.
 * Empêche l'accès direct à /authentication/2fa sans passer par /login.
 */
export const twoFactorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.pendingEmail()) {
    return true;
  }

  return router.createUrlTree(['/authentication/connexion']);
};