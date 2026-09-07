import { Routes } from '@angular/router';
import { authGuard, twoFactorGuard, resetPasswordGuard } from './core/auth/auth.guards';

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
          import('./core/authentification/pages/form-authentification/form-authentification.component')
            .then(c => c.FormAuthentificationComponent),
      },
      {
      path: 'verify-email',
      loadComponent: () =>
        import('./core/authentification/pages/verify-email/verify-email.component')
          .then(c => c.VerifyEmailComponent),
    },
      {
        path: '2fa',
        canActivate: [twoFactorGuard],
        loadComponent: () =>
          import('./core/authentification/pages/two-factor/two-factor.component')
            .then(c => c.TwoFactorComponent),
      },
      {
        path: 'preambule',
        loadComponent: () =>
          import('./core/authentification/pages/preambule-inscription/preambule-inscription.component')
            .then(c => c.PreambuleInscriptionComponent),
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./core/authentification/components/inscription/inscription.component')
            .then(c => c.InscriptionComponent),
      },
      {
        path: 'inscription/:option',
        loadComponent: () =>
          import('./core/authentification/components/inscription/inscription.component')
            .then(c => c.InscriptionComponent),
      },
      {
        path: 'succes',
        loadComponent: () =>
          import('./core/authentification/pages/succes-inscription/succes-inscription.component')
            .then(c => c.SuccesInscriptionComponent),
      },
      {
        path: 'echec',
        loadComponent: () =>
          import('./core/authentification/pages/echec-inscription/echec-inscription.component')
            .then(c => c.EchecInscriptionComponent),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./core/authentification/components/reset-password/reset-password.component')
            .then(c => c.ResetPasswordComponent),
      },
      {
        path: 'reset-password/:token',
        canActivate: [resetPasswordGuard],
        loadComponent: () =>
          import('./core/authentification/components/reset-password-form/reset-password-form.component')
            .then(c => c.ResetPasswordFormComponent),
      },
    ],
  },

  // ─── Routes protégées (standalone) ───────────────────────────────────────
  {
    path: 'parametres',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user-settings/pages/user-settings/user-settings.component')
        .then(c => c.UserSettingsComponent),
  },

  // ─── Dashboard (standalone routes) ───────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },

  // ─── Investissement (standalone routes) ──────────────────────────────────
  {
    path: 'investissement',
    loadChildren: () =>
      import('./investissement/investissement.routes').then(r => r.investissementRoutes),
  },

  // ─── Tarifs (standalone routes) ──────────────────────────────────────────
  {
    path: 'tarifs',
    loadChildren: () =>
      import('./tarifs/tarifs.routes').then(r => r.tarifsRoutes),
  },

  // ─── Information société (standalone routes) ──────────────────────────────
  {
    path: 'information-societe',
    loadChildren: () =>
      import('./information-societe/information-societe.routes').then(r => r.informationSocieteRoutes),
  },

  // ─── Accueil (CoreModule encore en NgModule) ──────────────────────────────
  {
  path: 'accueil',
  loadComponent: () =>
    import('./core/page/accueil/accueil.component')
      .then(c => c.AccueilComponent),
},
{
  path: 'watchlist',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./watchlist/watchlist.component').then(c => c.WatchlistComponent),
},
{
  path: 'portfolio',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./portfolio/portfolio.component').then(c => c.PortfolioComponent),
},
  {
    path: 'legal',
    children: [
      {
        path: 'politique-confidentialite',
        loadComponent: () =>
          import('./legal/politique-confidentialite/politique-confidentialite.component')
            .then(c => c.PolitiqueConfidentialiteComponent),
      },
      {
        path: 'mentions-legales',
        loadComponent: () =>
          import('./legal/mentions-legales/mentions-legales.component')
            .then(c => c.MentionsLegalesComponent),
      },
      {
        path: '',
        redirectTo: 'mentions-legales',
        pathMatch: 'full',
      },
    ],
  },

  // ─── 404 ─────────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: 'authentication/connexion',
  },
];