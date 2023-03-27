import { ResetPasswordGuard } from './services/reset-password.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { EchecInscriptionComponent } from './pages/echec-inscription/echec-inscription.component';
import { SuccesInscriptionComponent } from './pages/succes-inscription/succes-inscription.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { PreambuleInscriptionComponent } from './pages/preambule-inscription/preambule-inscription.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

const routes: Routes = [
  { path: 'preambule', component: PreambuleInscriptionComponent },
  { path: 'connexion', component: AuthentificationComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'formulaire', component: InscriptionComponent },
  { path: 'succes', component: SuccesInscriptionComponent },
  { path: 'echec', component: EchecInscriptionComponent },
  { path: 'password', component: ResetPasswordComponent},
  { path: 'reset-password/:token', component: ResetPasswordFormComponent, canActivate:[ResetPasswordGuard]
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutes { }

