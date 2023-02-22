import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { UserService } from '../../../users/services/user-service.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public items!: MenuItem[];
  public isLogged = false;
  public loggedUserName!: string;

  constructor(private readonly authentification: UserService) {}

  ngOnInit() {
    this.items = [
      { label: 'Tarif', routerLink: 'tarifs' },
      { label: 'Investir', routerLink: 'investissement' },
      { label: 'Académie' },
      {
        label: 'A propos de SVB Ind',
        items: [
          {
            label: "À propos d'Ottawa Pigeon",
            routerLink: 'information-societe/apropos',
          },
          { label: "Centre d'aide" },
          { label: 'Pourquoi nous choisir ?' },
        ],
      },
      { label: 'Des questions' },
    ];
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
    this.authentification.currentPersonalData$.subscribe((PersonalData) => {
      if (PersonalData.firstname) {
        this.loggedUserName = PersonalData.firstname;
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });
  }
}
