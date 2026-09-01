import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../auth/auth.service';
import { ResendVerificationEmailComponent } from '../../components/resend-verification-email/resend-verification-email.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CardModule, ButtonModule, ResendVerificationEmailComponent, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    
    <div class="grid mt-5 mx-2 p-fluid">
      <div class="col-12 lg:col-offset-4 lg:col-4 shadow-2">
        <p-card>
          @if (isLoading()) {
            <div class="text-center">
              <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-3"></i>
              <p class="text-color-secondary">Vérification en cours...</p>
            </div>
          } @else if (isVerified()) {
            <!-- ✅ Email vérifié -->
            <div class="text-center">
              <i class="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
              <h2 class="text-xl font-bold mb-2">Email vérifié !</h2>
              <p class="text-color-secondary mb-6">
                Votre adresse email a été confirmée avec succès.
              </p>
              <button
                pButton
                pRipple
                type="button"
                label="Aller à la connexion"
                class="w-full p-button-primary"
                (click)="goToLogin()">
              </button>
            </div>
          } @else {
            <!-- ℹ️ Affichage normal (pas de token ou en attente) -->
            <div class="text-center">
              <i class="pi pi-exclamation-circle text-4xl text-yellow-500 mb-3"></i>
              <h2 class="text-xl font-bold mb-2">Vérifiez votre adresse email</h2>
              <p class="text-color-secondary mb-4">
                Un mail de vérification a été envoyé :<br />
                <strong>{{ authService.pendingEmail() }}</strong>
              </p>
              <p class="text-sm text-color-secondary mb-6">
                Veuillez cliquer sur le lien contenu dans le mail pour valider votre compte.
              </p>
            </div>

            <div class="mb-4 p-4 bg-blue-50 border-left-4 border-blue-500 border-round">
              <p class="text-sm mb-0">
                <strong>💡 Conseil :</strong> Vérifiez aussi votre dossier indésirables/spam.
              </p>
            </div>

            <div class="mb-4">
              <div class="text-center mb-3">
                <span class="text-sm text-color-secondary">Vous n'avez pas reçu le mail ?</span>
              </div>
              <app-resend-verification-email></app-resend-verification-email>
            </div>

            <button
              pButton
              pRipple
              type="button"
              label="← Retour à la connexion"
              class="w-full p-button-text"
              (click)="goBack()">
            </button>
          }
        </p-card>
      </div>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  readonly isLoading = signal(false);
  readonly isVerified = signal(false);

  ngOnInit(): void {
    // Lire le token du query param
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyToken(token);
      }
    });
  }

  private verifyToken(token: string): void {
    this.isLoading.set(true);
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isVerified.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Votre email a été vérifié avec succès !',
        });
        setTimeout(() => this.goToLogin(), 3000);
      },
      error: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Le lien de vérification est invalide ou expiré.',
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/authentication/connexion']);
  }

  goToLogin(): void {
    this.router.navigate(['/authentication/connexion']);
  }
}