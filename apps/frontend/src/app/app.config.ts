import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { I18nService } from './i18n/i18n.service';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { ErrorHandler } from '@angular/core';

/**
 * Remplace AppModule + I18nModule.setLocale() + I18nModule.setLocaleId().
 *
 * Changements i18n vs v14 :
 *   - I18nModule.setLocale()   → APP_INITIALIZER sur I18nService.init()
 *   - I18nModule.setLocaleId() → LOCALE_ID factory depuis I18nService.locale
 *   - Plus de dépendance à webpack : imports statiques dans i18n.service.ts
 *
 * IMPORTANT : I18nService.init() doit s'exécuter AVANT AuthService.init()
 * car loadTranslations() doit être appelé avant que les composants
 * utilisant $localize soient instanciés.
 * L'ordre des providers n'est pas garanti → on utilise un seul APP_INITIALIZER
 * qui enchaîne les deux initialisations.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // ─── Routing ────────────────────────────────────────────────────────────
    provideRouter(routes, withComponentInputBinding()),

    // ─── HTTP + intercepteur Bearer/refresh ──────────────────────────────────
    provideHttpClient(withInterceptors([authInterceptor])),

    // ─── Animations ──────────────────────────────────────────────────────────
    provideAnimationsAsync(),

    // ─── i18n : locale ID dynamique depuis I18nService ───────────────────────
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nService) => i18nService.locale,
      deps: [I18nService],
    },

    // ─── Initialisation : i18n PUIS session auth ─────────────────────────────
    // Un seul APP_INITIALIZER pour garantir l'ordre d'exécution
    {
      provide: APP_INITIALIZER,
      useFactory: (i18nService: I18nService, authService: AuthService) =>
        async () => {
          await i18nService.init();   // 1. Charge les traductions
          await authService.init();   // 2. Restaure la session
        },
      deps: [I18nService, AuthService],
      multi: true,
    },

    // ─── Sentry (v8) ─────────────────────────────────────────────────────────
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },

    // ─── PrimeNG 19 ──────────────────────────────────────────────────────────
    // À décommenter après : npm install primeng@19
    //
    // import { providePrimeNG } from 'primeng/config';
    // import Aura from '@primeng/themes/aura';
    // providePrimeNG({ theme: { preset: Aura } }),
  ],
};