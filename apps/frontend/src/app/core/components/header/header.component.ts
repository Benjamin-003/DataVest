import { UserSettingsService } from './../../../user-settings/services/user-settings.service';
import { UserService } from './../../../authentification/services/user-service.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public items!: MenuItem[];
  public isLogged = false;
  public loggedUserName!: string;
  public loggedUserId!:number;
  constructor(private readonly authentification: UserService, private settings:UserSettingsService) { }

  ngOnInit() {
    this.items = [{ label: "Tarif", routerLink: "tarifs" }, { label: "Investir", routerLink: "investissement" }, { label: "Académie" }, {
      label: "A propos de SVB Ind",
      items: [{ label: "À propos d'Ottawa Pigeon", routerLink: "information-societe/apropos" }, { label: "Centre d'aide" }, { label: "Pourquoi nous choisir ?" }]
    },
    { label: "Des questions" }];
    this.getLoggedUser();
  }

  //Méthode de cycle de vie qui va checker si il y a un changement dans l'authentification
  ngDoCheck() {
    if (this.authentification.currentLoggedUser) {
      this.getLoggedUser();
    }
  }

  //Récupère le nom de l'utilisateur et passe le boolean a true si un utilisateur est connecté ou false dans le cas contraire
  getLoggedUser() {
    this.authentification.currentLoggedUser.subscribe(resultLoggedUser => {
      if (resultLoggedUser.id && resultLoggedUser.firstname) {
        this.loggedUserName = resultLoggedUser.firstname;
        this.loggedUserId = resultLoggedUser.id;
        this.isLogged = true;
      }
      else {
        this.isLogged = false;
      }
    })
  }
}
