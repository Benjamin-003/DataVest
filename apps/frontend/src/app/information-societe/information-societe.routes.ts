import { Routes } from '@angular/router';

export const informationSocieteRoutes: Routes = [
  {
    path: 'apropos',
    loadComponent: () =>
      import('./a-propos-ottawa-pigeon/a-propos-ottawa-pigeon.component')
        .then(c => c.AProposOttawaPigeonComponent),
  },
];