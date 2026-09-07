import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'macroeconomicnews',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
  },
];