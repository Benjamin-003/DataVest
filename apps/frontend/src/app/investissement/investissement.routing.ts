import { ImpotsComponent } from './composants/autres-placements/impots/impots.component';
import { AssuranceVieComponent } from './composants/autres-placements/assurance-vie/assurance-vie.component';
import { SicavFondsComponent } from './composants/autres-placements/sicav-fonds/sicav-fonds.component';
import { RetraiteComponent } from './composants/autres-placements/retraite/retraite.component';
import { ImmobilierComponent } from './composants/autres-placements/immobilier/immobilier.component';
import { VideosComponent } from './composants/investir-responsable/videos/videos.component';
import { DossierComponent } from './composants/investir-responsable/dossier/dossier.component';
import { AccueilInvestirResponsableComponent } from './composants/investir-responsable/accueil-investir-responsable/accueil-investir-responsable.component';
import { ConseilsComponent } from './composants/actualités/conseils/conseils.component';
import { VideoInvestisseurComponent } from './composants/actualités/video-investisseur/video-investisseur.component';
import { LeJournalComponent } from './composants/actualités/le-journal/le-journal.component';
import { LaSeanceComponent } from './composants/actualités/la-seance/la-seance.component';
import { MatieresPremieresComponent } from './composants/cotations/matieres-premieres/matieres-premieres.component';
import { ProduitsDerivesComponent } from './composants/cotations/produits-derives/produits-derives.component';
import { ObligationsComponent } from './composants/cotations/obligations/obligations.component';
import { CryptomonnaieComponent } from './composants/cotations/cryptomonnaie/cryptomonnaie.component';
import { PalmaresComponent } from './composants/cotations/palmares/palmares.component';
import { CotationsComponent } from './composants/cotations/cotations/cotations.component';
import { InvestissementComponent } from './pages/investissement/investissement.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path:'', component: InvestissementComponent},
  {path:'Cotations', component: CotationsComponent},
  {path:'Palmares', component: PalmaresComponent},
  {path:'Cryptomonnaie', component: CryptomonnaieComponent},
  {path:'Obligations', component: ObligationsComponent},
  {path:'ProduitsDerives', component: ProduitsDerivesComponent},
  {path:'MatieresPremieres', component: MatieresPremieresComponent},
  {path:'LaSeances', component: LaSeanceComponent},
  {path:'LeJournal', component: LeJournalComponent},
  {path:'VideoInvestisseur', component: VideoInvestisseurComponent},
  {path:'NosConseils', component: ConseilsComponent},
  {path:'AccueilInvestirResponsable', component: AccueilInvestirResponsableComponent},
  {path:'Dossier', component: DossierComponent},
  {path:'Videos', component: VideosComponent},
  {path:'Immobilier', component: ImmobilierComponent},
  {path:'Retraite', component: RetraiteComponent},
  {path:'SicavFonds', component: SicavFondsComponent},
  {path:'AssuranceVie', component: AssuranceVieComponent},
  {path:'Impots', component: ImpotsComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestissementRoutes{}
