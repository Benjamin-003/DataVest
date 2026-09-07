import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthApiService } from './auth.api';

/**
 * État partagé pour la file d'attente des requêtes pendant le refresh.
 * Déclaré en dehors de la fonction pour persister entre les appels.
 */
let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

/**
 * Intercepteur HTTP fonctionnel (Angular 15+).
 *
 * Responsabilités :
 * 1. Injecte le header Authorization: Bearer <token> sur chaque requête
 * 2. Sur 401 : tente un refresh token silencieux
 *    - Si le refresh réussit → rejoue la requête originale avec le nouveau token
 *    - Si plusieurs requêtes échouent en même temps → les met en file d'attente
 *      et les rejoue toutes une fois le refresh terminé
 *    - Si le refresh échoue → forceLogout() → redirection /login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authApi = inject(AuthApiService);

  // Ajoute le Bearer token si disponible
  const token = authService.accessToken;
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // On ne tente le refresh que sur les 401
      // et uniquement si ce n'est pas la route /refresh elle-même
      if (error.status !== 401 || req.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      const refreshToken = authService.refreshToken;

      // Pas de refresh token disponible → logout immédiat
      if (!refreshToken) {
        authService.forceLogout();
        return throwError(() => error);
      }

      // Un refresh est déjà en cours → mettre la requête en attente
      if (isRefreshing) {
        return refreshDone$.pipe(
          filter((newToken): newToken is string => newToken !== null),
          take(1),
          switchMap((newToken) =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
          )
        );
      }

      // Lancer le refresh
      isRefreshing = true;
      refreshDone$.next(null);

      return authApi.refresh(refreshToken).pipe(
        switchMap(({ accessToken, refreshToken: newRefreshToken }) => {
          isRefreshing = false;
          // Sauvegarder les nouveaux tokens via le service
          // Note: on accède directement au sessionStorage ici pour éviter une
          // dépendance circulaire (AuthService → AuthApiService → intercepteur)
          sessionStorage.setItem('access_token', accessToken);
          sessionStorage.setItem('refresh_token', newRefreshToken);
          refreshDone$.next(accessToken);

          // Rejouer la requête originale avec le nouveau token
          return next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
        }),
        catchError((refreshError) => {
          // Refresh échoué → déconnecter l'utilisateur
          isRefreshing = false;
          refreshDone$.next(null);
          authService.forceLogout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};