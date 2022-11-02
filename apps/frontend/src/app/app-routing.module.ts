import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path: '', redirectTo: 'accueil', pathMatch: 'full' },
{path: 'accueil', loadChildren: () => import('./core/core.module').then(m => m.CoreModule)},
{path: 'Investissement', loadChildren: () => import('./investissement/investissement.module').then(m => m.InvestissementModule)}];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
