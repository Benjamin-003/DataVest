import { AuthentificationGuard } from './authentification/services/authentification-guard.guard';
import { AccueilComponent } from './core/page/accueil/accueil.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'investissement', loadChildren: () => import('./investissement/investissement.module').then(m => m.InvestissementModule) },
  { path: 'tarifs', loadChildren: () => import('./tarifs/tarifs.module').then(m => m.TarifsModule) },
  { path: 'authentification', loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule) },
  { path: 'information-societe', loadChildren: () => import('./information-societe/information-societe.module').then(m => m.InformationSocieteModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [AuthentificationGuard] },
  { path: 'parametres', loadChildren: () => import('./user-settings/user-settings.module').then(m => m.UserSettingsModule),canActivate: [AuthentificationGuard] },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
