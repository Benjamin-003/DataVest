import { UserService } from '../../../users/services/user-service.service';
import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-authentification',
    templateUrl: './authentification.component.html',
    providers: [MessageService],
    standalone: true
})
export class AuthentificationComponent {
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  //Cette méthode va appeler le back pour authentification
  signIn(credential: Credential) {
    this.userService.signInUser(credential).subscribe({
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Email et/ou mot de passe incorrect',
        });
      },
      complete: () => {
        this.router.navigate(['dashboard/macroeconomicnews']).then(() =>location.reload());
      }
    });
  }
}
