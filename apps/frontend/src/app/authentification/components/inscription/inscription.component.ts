import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from 'src/app/subscriptions/subscriptions.service';
import { Subscription } from 'src/app/subscriptions/subscription.model';
import { UserService } from 'src/app/users/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html'
})
export class InscriptionComponent implements OnInit {
  public label!: MenuItem[]
  public subscriptions!: Subscription[];
  public defaultBackOption!: string;

  constructor(private readonly subscriptionsService: SubscriptionsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly inscription: UserService
  ) { }
  public selectedOption!: string;

  ngOnInit() {
    //Voici les label a transmettre pour le composant d'acheminement des étapes
    this.label = [
      { label: "Formulaire d'inscription" },
      { label: 'Ouverture du compte' }
    ]
    //On récupère les formules d'abonnement
    this.subscriptionsService.getSubscriptions().subscribe(results => {
      this.subscriptions = results;
      this.subscriptions.forEach(option=>{
        if(option.isDefault){
          this.defaultBackOption = option.code;
        }
      })});
    }

  //On transmet les valeurs de formulaire depuis le componsant parent
  validateFormToBack($event: any) {
    this.inscription.createUser($event).subscribe({
      error: () => {
        this.router.navigate(['../echec'], { relativeTo: this.route }).then();
      },
      complete: () => {
        this.router.navigate(['../succes'], { relativeTo: this.route }).then();
      }
    })
  }
}
