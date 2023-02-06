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

  constructor(private router: ActivatedRoute, private readonly userService: UserService, private readonly messageService: MessageService,) { }

  ngOnInit() {
    this.router.data.subscribe(data => { this.personalData = data['user'] })
  }

  updatePersonnalInformation(updatedDataUser: PersonalData) {
    this.userService.updtateUser(updatedDataUser).subscribe({
       error: () => {
        this.messageService.add({
          severity: "error", detail: "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard"
        })
      },
      complete:()=>{
        this.messageService.add({
        severity: "success", detail: "Vos modifications ont bien été prises en compte et votre profil a été mis à jour."
      })
      }
    })
  }
}

