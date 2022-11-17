import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path: '', redirectTo: 'accueil', pathMatch: 'full' },
{path: 'accueil', loadChildren: () => import('./core/core.module').then(m => m.CoreModule)},
{path: 'investissement', loadChildren: () => import('./investissement/investissement.module').then(m => m.InvestissementModule)},
{path: 'tarifs', loadChildren: () => import('./tarifs/tarifs.module').then(m => m.TarifsModule)},
{path: 'authentification', loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule)}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
