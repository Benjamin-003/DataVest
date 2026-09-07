import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-resend-verification-email',
  standalone: true,
  imports: [ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './resend-verification-email.component.html',
})
export class ResendVerificationEmailComponent {
  protected readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  readonly loading = signal(false);

  submit(): void {
    const email = this.authService.pendingEmail();
    if (!email) return;

    this.loading.set(true);

    this.authService.resendVerificationEmail(email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Un nouveau mail de vérification a été envoyé à votre adresse.',
        });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de renvoyer le mail. Veuillez réessayer.',
        });
      },
    });
  }
}