import { Observable, of } from 'rxjs';
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
  public loggedUserName!: Observable<string>;
  constructor(private readonly authentification: UserService) { }

  ngOnInit() {
    this.items = [{ label: "Tarif", routerLink: "tarifs" }, { label: "Investir", routerLink: "investissement" }, { label: "Académie" }, {
      label: "A propos de SVB Ind",
      items: [{ label: "À propos d'Ottawa Pigeon", routerLink: "information-societe/apropos" }, { label: "Centre d'aide" }, { label: "Pourquoi nous choisir ?" }]
    },
    { label: "Des questions" }];
    this.getLoggedUserName();
  }

  //Méthode de cycle de vie qui va checker si il y a un changement dans l'authentification
  ngDoCheck() {
    if (this.authentification.currentLoggedUserName) {
      this.getLoggedUserName();
    }
  }

  //Récupère le nom de l'utilisateur et passe le boolean a true si un utilisateur est connecté ou false dans le cas contraire
  getLoggedUserName() {
    this.authentification.currentLoggedUserName.subscribe(resultName => {
      if (resultName) {
        this.loggedUserName = of(resultName);
        this.isLogged = true;
      }
      else {
        this.isLogged = false;
      }
    })
  }
}
