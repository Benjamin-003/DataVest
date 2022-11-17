import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html'
})
export class InscriptionComponent implements OnInit {
  public label!: MenuItem[]
  ngOnInit() {
    //Voici les label a transmettre pour le composant d'acheminement des étapes
    this.label = [
      { label: "Formulaire d'inscription"},
      { label: 'Ouverture du compte' }
    ]
  }

}
