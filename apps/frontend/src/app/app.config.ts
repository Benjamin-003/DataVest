import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { I18nService } from './i18n/i18n.service';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

/**
 * Thème personnalisé Ottawa Pigeon :
 * - Base : Aura (PrimeNG 19 preset)
 * - Couleur primaire : #D08770 (orange du thème original)
 * - Mode sombre activé via la classe CSS .dark sur <html>
 */
const OttawaPigeonPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '#D08770',
      600: '#b8735e',
      700: '#9e5f4c',
      800: '#844b3a',
      900: '#6a3728',
      950: '#501e16',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    // ─── Routing ────────────────────────────────────────────────────────────
    provideRouter(routes, withComponentInputBinding()),

    // ─── HTTP + intercepteur Bearer/refresh ──────────────────────────────────
    provideHttpClient(withInterceptors([authInterceptor])),

    // ─── Animations ──────────────────────────────────────────────────────────
    provideAnimationsAsync(),

    // ─── PrimeNG 19 — preset Aura avec couleurs Ottawa Pigeon ────────────────
    providePrimeNG({
      theme: {
        preset: OttawaPigeonPreset,
        options: {
          darkModeSelector: '.dark',  // ajouter class="dark" sur <html> pour le mode sombre
          cssLayer: false,
        },
      },
      ripple: true,
    }),

    // ─── i18n ─────────────────────────────────────────────────────────────────
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nService) => i18nService.locale,
      deps: [I18nService],
    },

    // ─── Initialisation ───────────────────────────────────────────────────────
    {
      provide: APP_INITIALIZER,
      useFactory: (i18nService: I18nService, authService: AuthService) =>
        async () => {
          await i18nService.init();
          await authService.init();
        },
      deps: [I18nService, AuthService],
      multi: true,
    },
  ]
};