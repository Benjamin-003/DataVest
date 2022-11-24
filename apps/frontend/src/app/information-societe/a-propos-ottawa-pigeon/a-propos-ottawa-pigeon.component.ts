import { Component } from '@angular/core';
const pictureAPI = "https://picsum.photos/200?random="
@Component({
  selector: 'app-a-propos-ottawa-pigeon',
  templateUrl: './a-propos-ottawa-pigeon.component.html',
})
export class AProposOttawaPigeonComponent {
  public randomNumberURL: string[] = []
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
  expertiseField = [{name: "Analyser les principaux marches financiers (marches d’actions/Obligataires/monétaires/Cryptomonnaie)",imageURL:pictureAPI+0},
  {name: "Partager les informations, decryptage de l’actualité économique, des indicateurs financiers et cotations",imageURL:pictureAPI+1},
  {name: "Permettre à des investisseurs d’avoir toutes les cartes en main au moment de prendre position",imageURL:pictureAPI+2},
  {name: "Conseiller sur les investissements et la gestion de portefeuille",imageURL:pictureAPI+3},
  {name: "Le point sur les tendances du moment",imageURL:pictureAPI+4}
  ]
}
