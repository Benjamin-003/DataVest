import { EchecInscriptionComponent } from './pages/echec-inscription/echec-inscription.component';
import { SuccesInscriptionComponent } from './pages/succes-inscription/succes-inscription.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { PreambuleInscriptionComponent } from './pages/preambule-inscription/preambule-inscription.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: 'preambule', component: PreambuleInscriptionComponent },
  { path: 'connexion', component: AuthentificationComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'formulaire', component: InscriptionComponent },
  { path: 'succes', component: SuccesInscriptionComponent },
  { path: 'echec', component: EchecInscriptionComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutes { }

