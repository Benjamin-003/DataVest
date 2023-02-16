import { LanguagesService } from './../../../languages/languages.service';
import { Language } from '../../../languages/interfaces/language.model';
import { Password } from './../../../users/interfaces/password.model';
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
  public personalData: PersonalData = {
    surname: '',
    firstname: '',
    birth_date: '',
    address: '',
    zip_code: '',
    city: '',
    country: '',
    mail: '',
    language_code: ''
  }
  private _personalDataSubscription!: Subscription
  private message = ["Votre nouvelle adresse mail est bien prise en compte",
    "Vos modifications ont bien été prises en compte et votre profil a été mis à jour",
    "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard",
    "Votre nouveau mot de passe a bien été enregistré",
    "Votre nouveau mot de passe n'a pas pu être sauvegardé. Veuillez réessayer plus tard"
  ]
  languages!: Language[]

  constructor(private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly languageService: LanguagesService
  ) { }

  ngOnInit() {
    this._personalDataSubscription = this.userService.currentPersonalData$.subscribe((personalData) => this.personalData = personalData)
    this.languageService.getLanguages().subscribe(
      (languageData: Language[]) => {
         this.languages = languageData;
      }
   );
  }

  ngOnDestroy() {
    this._personalDataSubscription.unsubscribe()
  }

  //Cette méthode appelle le back pour mettre à jour les données de l'utilisateur autre que le mot de passe
  updatePersonalData(PersonalData: PersonalData, indexMessage: number) {
    this.userService.updateUser(PersonalData).subscribe({
      error: () => {
        this.messageService.add({
          severity: "error", detail: this.message[2]
        })
      },
      complete: () => {
        this.messageService.add({
          severity: "success", detail: this.message[indexMessage]
        })
      }
    })
  }

  //Méthode qui appelle le back pour la modification du mot de passe de l'utilisateur
  updatePassword(password: Password) {
    this.userService.updatePassword(password).subscribe({
      error: () => {
        this.messageService.add({
          severity: "error", detail: this.message[4]
        })
      },
      complete: () => {
        this.messageService.add({
          severity: "success", detail: this.message[3]
        })
      }
    })
  }

}

