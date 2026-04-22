import { Routes } from '@angular/router';
import { authGuard, twoFactorGuard, resetPasswordGuard } from './core/auth/auth.guards';

/**
 * Routes hybrides — loadComponent pour les composants standalone migrés,
 * loadChildren pour les modules pas encore migrés (dashboard, investissement, etc.)
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication/connexion',
    pathMatch: 'full',
  },

  // ─── Authentification (standalone) ───────────────────────────────────────
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
        canActivate: [twoFactorGuard],
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

  // ─── Routes protégées (standalone) ───────────────────────────────────────
  {
    path: 'parametres',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user-settings/pages/user-settings/user-settings.component')
        .then((c) => c.UserSettingsComponent),
  },

  // ─── Modules pas encore migrés → loadChildren ────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'investissement',
    loadChildren: () =>
      import('./investissement/investissement.module').then((m) => m.InvestissementModule),
  },
  {
    path: 'tarifs',
    loadChildren: () =>
      import('./tarifs/tarifs.module').then((m) => m.TarifsModule),
  },
  {
    path: 'information-societe',
    loadChildren: () =>
      import('./information-societe/information-societe.module')
        .then((m) => m.InformationSocieteModule),
  },

  // ─── Accueil (CoreModule) ─────────────────────────────────────────────────
  {
    path: 'accueil',
    loadChildren: () =>
      import('./core/core.module').then((m) => m.CoreModule),
  },

  // ─── 404 ─────────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: 'authentication/connexion',
  },
];