import { Component } from '@angular/core';
const pictureAPI = "https://picsum.photos/200?random="
@Component({
  selector: 'app-a-propos-ottawa-pigeon',
  templateUrl: './a-propos-ottawa-pigeon.component.html'
})
export class AProposOttawaPigeonComponent {

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ]
  expertiseField = ["Analyser les principaux marches financiers (marches d’actions/Obligataires/monétaires/Cryptomonnaie)",
    "Partager les informations, decryptage de l’actualité économique, des indicateurs financiers et cotations",
    "Permettre à des investisseurs d’avoir toutes les cartes en main au moment de prendre position",
    "Conseiller sur les investissements et la gestion de portefeuille",
    "Le point sur les tendances du moment"
  ]
  //Cette méthode renvoi un entier que l'on integre a chaque appel de l'URL de l'API pour obtenir une image différente
  getRandomNum() {
    return pictureAPI + Math.random() * 10
  }
}
