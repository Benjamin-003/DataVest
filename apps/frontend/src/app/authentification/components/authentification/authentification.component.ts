import { UserService } from '../../../users/services/user-service.service';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  providers: [MessageService],
})
export class AuthentificationComponent {
  constructor(
    private readonly authentification: UserService,
    private readonly messageService: MessageService,
    private readonly router: Router
  ) {}

  //Cette méthode va appeler le back pour authentification
  signIn(credential: Credential) {
    this.authentification.signInUser(credential).subscribe({
      next: (result) => {
        this.authentification.getUser(result.id).subscribe((user: any) => {
          this.authentification.currentLoggedUser.next({
            id: result.id,
            firstname: user.firstname,
          });
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Email et/ou mot de passe incorrect',
        });
      },
      complete: () => {
        this.router.navigate(['dashboard/macroeconomicnews']);
      },
    });
  }
}
