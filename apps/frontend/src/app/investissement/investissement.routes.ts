import { Routes } from '@angular/router';

// Note : les composants d'investissement ont été déplacés vers src/app/investissement/composants/
// Le dossier "actualités" (avec accent) a été renommé "actualites" pour éviter les problèmes d'encodage

export const investissementRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/investissement/investissement.component').then(c => c.InvestissementComponent),
  },
  {
    path: 'Cotations',
    loadComponent: () =>
      import('./composants/cotations/cotations/cotations.component').then(c => c.CotationsComponent),
  },
  {
    path: 'Palmares',
    loadComponent: () =>
      import('./composants/cotations/palmares/palmares.component').then(c => c.PalmaresComponent),
  },
  {
    path: 'Cryptomonnaie',
    loadComponent: () =>
      import('./composants/cotations/cryptomonnaie/cryptomonnaie.component').then(c => c.CryptomonnaieComponent),
  },
  {
    path: 'Obligations',
    loadComponent: () =>
      import('./composants/cotations/obligations/obligations.component').then(c => c.ObligationsComponent),
  },
  {
    path: 'ProduitsDerives',
    loadComponent: () =>
      import('./composants/cotations/produits-derives/produits-derives.component').then(c => c.ProduitsDerivesComponent),
  },
  {
    path: 'MatieresPremieres',
    loadComponent: () =>
      import('./composants/cotations/matieres-premieres/matieres-premieres.component').then(c => c.MatieresPremieresComponent),
  },
  {
    path: 'LaSeances',
    loadComponent: () =>
      import('./composants/actualites/la-seance/la-seance.component').then(c => c.LaSeanceComponent),
  },
  {
    path: 'LeJournal',
    loadComponent: () =>
      import('./composants/actualites/le-journal/le-journal.component').then(c => c.LeJournalComponent),
  },
  {
    path: 'VideoInvestisseur',
    loadComponent: () =>
      import('./composants/actualites/video-investisseur/video-investisseur.component').then(c => c.VideoInvestisseurComponent),
  },
  {
    path: 'NosConseils',
    loadComponent: () =>
      import('./composants/actualites/conseils/conseils.component').then(c => c.ConseilsComponent),
  },
  {
    path: 'AccueilInvestirResponsable',
    loadComponent: () =>
      import('./composants/investir-responsable/accueil-investir-responsable/accueil-investir-responsable.component')
        .then(c => c.AccueilInvestirResponsableComponent),
  },
  {
    path: 'Dossier',
    loadComponent: () =>
      import('./composants/investir-responsable/dossier/dossier.component').then(c => c.DossierComponent),
  },
  {
    path: 'Videos',
    loadComponent: () =>
      import('./composants/investir-responsable/videos/videos.component').then(c => c.VideosComponent),
  },
  {
    path: 'Immobilier',
    loadComponent: () =>
      import('./composants/autres-placements/immobilier/immobilier.component').then(c => c.ImmobilierComponent),
  },
  {
    path: 'Retraite',
    loadComponent: () =>
      import('./composants/autres-placements/retraite/retraite.component').then(c => c.RetraiteComponent),
  },
  {
    path: 'SicavFonds',
    loadComponent: () =>
      import('./composants/autres-placements/sicav-fonds/sicav-fonds.component').then(c => c.SicavFondsComponent),
  },
  {
    path: 'AssuranceVie',
    loadComponent: () =>
      import('./composants/autres-placements/assurance-vie/assurance-vie.component').then(c => c.AssuranceVieComponent),
  },
  {
    path: 'Impots',
    loadComponent: () =>
      import('./composants/autres-placements/impots/impots.component').then(c => c.ImpotsComponent),
  },
];