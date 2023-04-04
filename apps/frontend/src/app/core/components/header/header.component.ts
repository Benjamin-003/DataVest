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
  public signUp = $localize`:@@header.signUp:Ouvrir un compte`
  private _currentUserSubscription!: Subscription;

  constructor(private readonly authentification: UserService, private readonly router: Router) { }

  ngOnInit() {
    this.items = [
      { label: $localize`:@@header.price:Tarif`, routerLink: 'tarifs' },
      { label: $localize`:@@header.invest:Investir`, routerLink: 'investissement' },
      { label: $localize`:@@header.academy:Académie` },
      {
        label: $localize`:@@header.aboutSVBInd:A propos de SVB Ind`,
        items: [
          {
            label: $localize`:@@header.aboutOttawaPigeon:À propos d'Ottawa Pigeon`,
            routerLink: 'information-societe/apropos',
          },
          { label: $localize`:@@header.helpCenter:Centre d'aide` },
          { label: $localize`:@@header.whyChooseUs:Pourquoi nous choisir ?` },
        ],
      },
      { label: $localize`:@@header.anyQuestions:Des questions ?` }
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
    this.router.navigate(['accueil']).then(() => location.reload())
  }
}
