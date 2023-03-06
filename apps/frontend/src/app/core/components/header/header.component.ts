import { UserService } from '../../../users/services/user-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public items!: MenuItem[];
  public isLogged = false;
  public loggedUserName!: string;
  private _currentUserSubscription!: Subscription;

  constructor(private readonly authentification: UserService, private readonly router: Router) { }

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

  ngOnDestroy() {
    this._currentUserSubscription.unsubscribe();
  }

  //Récupère le nom de l'utilisateur et passe le boolean a true si un utilisateur est connecté ou false dans le cas contraire
  getLoggedUser() {
    this._currentUserSubscription = this.authentification.currentPersonalData$.subscribe((personalData) => {
      if (personalData.firstname) {
        this.loggedUserName = personalData.firstname;
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });
  }


  //Gère la deconnexion de l'utilsateur
  logOffUser() {
    this.authentification.deleteUserToken()
    this.router.navigate(['accueil'])
  }
}
