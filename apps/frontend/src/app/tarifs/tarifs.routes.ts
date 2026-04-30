import { Routes } from '@angular/router';

export const tarifsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./composants/tarifs/tarifs.component').then(c => c.TarifsComponent),
  },
];