import { UserService } from './../../../users/services/user-service.service';
import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  providers: [MessageService]
})
export class UserSettingsComponent implements OnInit {
  public personalData!: PersonalData
  private message=["Votre nouvelle adresse mail est bien prise en compte",
                    "Vos modifications ont bien été prises en compte et votre profil a été mis à jour",
                    "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard"
                  ]

  constructor(private router: ActivatedRoute,
              private readonly userService: UserService,
              private readonly messageService: MessageService,
            ) { }

  ngOnInit() {
    this.router.data.subscribe(data => { this.personalData = data['user'] })
  }

  //Méthode qui appelle le back pour la modification du mail de l'utilisateur
  updateEmail(mail:PersonalData){
    this.userService.updtateUser(mail).subscribe({
      error: () => {
        this.messageService.add({
          severity: "error", detail: this.message[2]
        })
      },
      complete:()=>{
        this.messageService.add({
        severity: "success", detail: this.message[0]
      })
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
      complete:()=>{
        this.messageService.add({
        severity: "success", detail: this.message[1]
      })
      }
    })
  }
}

