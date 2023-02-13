import { Observable, Subscription } from 'rxjs';
import { UserService } from './../../../users/services/user-service.service';
import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  providers: [MessageService]
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  public personalData!: PersonalData
  public personalData$!: Observable<PersonalData>
  private _personalDataSubscription!: Subscription
  private message = ["Votre nouvelle adresse mail est bien prise en compte",
    "Vos modifications ont bien été prises en compte et votre profil a été mis à jour",
    "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard"
  ]

  constructor(private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit() {
    this.personalData$ = this.userService.currentPersonalData$

    this._personalDataSubscription = this.personalData$.subscribe((personalData) => this.personalData = personalData)
  }

  ngOnDestroy() {
    this._personalDataSubscription.unsubscribe()
  }

  //Méthode qui appelle le back pour la modification du mail de l'utilisateur
  updateEmail(form: { mail: string }) {
    this.userService.updtateUser(form as PersonalData).subscribe({
      error: () => {
        this.messageService.add({
          severity: "error", detail: this.message[2]
        })
      },
      complete: () => {
        this.messageService.add({
          severity: "success", detail: this.message[0]
        })
        this.personalData.mail = form.mail
      }
    })
  }

  //Méthode qui appelle le back pour la modification des données personnelles de l'utilisateur
  updatePersonnalInformation(updatedDataUser: PersonalData) {
    this.userService.updtateUser(updatedDataUser).subscribe({
      error: () => {
        this.messageService.add({
          severity: "error", detail: this.message[2]
        })
      },
      complete: () => {
        this.messageService.add({
          severity: "success", detail: this.message[1]
        })
      }
    })
  }
}

