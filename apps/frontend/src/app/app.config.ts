import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ─── Routing ────────────────────────────────────────────────────────────
    provideRouter(
      routes,
      withComponentInputBinding() // permet de binder les paramètres de route en @Input
    ),

    // ─── HTTP + intercepteur Bearer/refresh ──────────────────────────────────
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // ─── Animations (PrimeNG en a besoin) ────────────────────────────────────
    provideAnimationsAsync(),

    // ─── Initialisation : tente de restaurer la session au démarrage ─────────
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.init(),
      deps: [AuthService],
      multi: true,
    },


  ],
};