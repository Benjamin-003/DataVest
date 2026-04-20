import { Routes } from '@angular/router';
import { authGuard, twoFactorGuard, resetPasswordGuard } from './core/auth/auth.guards';


export const routes: Routes = [
  // ─── Redirection racine ───────────────────────────────────────────────────
  {
    path: '',
    redirectTo: 'authentication/connexion',
    pathMatch: 'full',
  },

  // ─── Authentification (public) ────────────────────────────────────────────
  {
    path: 'authentication',
    children: [
      {
        path: 'connexion',
        loadComponent: () =>
          import('./authentification/pages/form-authentification/form-authentification.component')
            .then((c) => c.FormAuthentificationComponent),
      },
      {
        path: '2fa',
        canActivate: [twoFactorGuard], // bloque l'accès direct sans passer par /login
        loadComponent: () =>
          import('./authentification/pages/two-factor/two-factor.component')
            .then((c) => c.TwoFactorComponent),
      },
      {
        path: 'preambule',
        loadComponent: () =>
          import('./authentification/pages/preambule-inscription/preambule-inscription.component')
            .then((c) => c.PreambuleInscriptionComponent),
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./authentification/components/inscription/inscription.component')
            .then((c) => c.InscriptionComponent),
      },
      {
        path: 'inscription/:option',
        loadComponent: () =>
          import('./authentification/components/inscription/inscription.component')
            .then((c) => c.InscriptionComponent),
      },
      {
        path: 'succes',
        loadComponent: () =>
          import('./authentification/pages/succes-inscription/succes-inscription.component')
            .then((c) => c.SuccesInscriptionComponent),
      },
      {
        path: 'echec',
        loadComponent: () =>
          import('./authentification/pages/echec-inscription/echec-inscription.component')
            .then((c) => c.EchecInscriptionComponent),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./authentification/components/reset-password/reset-password.component')
            .then((c) => c.ResetPasswordComponent),
      },
      {
        path: 'reset-password/:token',
        canActivate: [resetPasswordGuard],
        loadComponent: () =>
          import('./authentification/components/reset-password-form/reset-password-form.component')
            .then((c) => c.ResetPasswordFormComponent),
      },
    ],
  },

  // ─── Routes protégées ─────────────────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((c) => c.DashboardComponent),
    children: [
      {
        path: 'macroeconomicnews',
        loadComponent: () =>
          import('./dashboard/pages/macroeconomic-news/macroeconomic-news.component')
            .then((c) => c.MacroeconomicNewsComponent),
      },
      // Ajouter les autres sous-routes du dashboard ici
    ],
  },
  {
    path: 'investissement',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./investissement/investissement.component').then((c) => c.InvestissementComponent),
  },
  {
    path: 'tarifs',
    loadComponent: () =>
      import('./tarifs/tarifs.component').then((c) => c.TarifsComponent),
  },
  {
    path: 'information-societe',
    loadComponent: () =>
      import('./information-societe/information-societe.component')
        .then((c) => c.InformationSocieteComponent),
  },
  {
    path: 'parametres',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user-settings/pages/user-settings/user-settings.component')
        .then((c) => c.UserSettingsComponent),
  },

  // ─── 404 ──────────────────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('./core/page/not-found/not-found.component').then((c) => c.NotFoundComponent),
  },
];