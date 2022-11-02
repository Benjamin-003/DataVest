import { DossierComponent } from './composants/investir-responsable/dossier/dossier.component';
import { VideosComponent } from './composants/investir-responsable/videos/videos.component';
import { AccueilInvestirResponsableComponent } from './composants/investir-responsable/accueil-investir-responsable/accueil-investir-responsable.component';
import { ProduitsDerivesComponent } from './composants/cotations/produits-derives/produits-derives.component';
import { PalmaresComponent } from './composants/cotations/palmares/palmares.component';
import { ObligationsComponent } from './composants/cotations/obligations/obligations.component';
import { MatieresPremieresComponent } from './composants/cotations/matieres-premieres/matieres-premieres.component';
import { CryptomonnaieComponent } from './composants/cotations/cryptomonnaie/cryptomonnaie.component';
import { CotationsComponent } from './composants/cotations/cotations/cotations.component';
import { SicavFondsComponent } from './composants/autres-placements/sicav-fonds/sicav-fonds.component';
import { RetraiteComponent } from './composants/autres-placements/retraite/retraite.component';
import { ImpotsComponent } from './composants/autres-placements/impots/impots.component';
import { ImmobilierComponent } from './composants/autres-placements/immobilier/immobilier.component';
import { AssuranceVieComponent } from './composants/autres-placements/assurance-vie/assurance-vie.component';
import { VideoInvestisseurComponent } from './composants/actualités/video-investisseur/video-investisseur.component';
import { LeJournalComponent } from './composants/actualités/le-journal/le-journal.component';
import { LaSeanceComponent } from './composants/actualités/la-seance/la-seance.component';
import { ConseilsComponent } from './composants/actualités/conseils/conseils.component';
import { InvestissementComponent } from './pages/investissement/investissement.component';
import { InvestissementRoutes } from './investissement.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, } from 'primeng/card';

@NgModule({
  declarations: [InvestissementComponent, ConseilsComponent,
    LaSeanceComponent,
    LeJournalComponent,
    VideoInvestisseurComponent,
    AssuranceVieComponent,
    ImmobilierComponent,
    ImpotsComponent,
    RetraiteComponent,
    SicavFondsComponent,
    CotationsComponent,
    CryptomonnaieComponent,
    MatieresPremieresComponent,
    ObligationsComponent,
    PalmaresComponent,
    ProduitsDerivesComponent,
    AccueilInvestirResponsableComponent,
    DossierComponent,
    VideosComponent],
  imports: [
    CommonModule,
    InvestissementRoutes,
    CardModule
  ],
  exports: [
    InvestissementComponent
  ]
})
export class InvestissementModule { }
