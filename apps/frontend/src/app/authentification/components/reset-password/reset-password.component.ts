import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * Formulaire "mot de passe oublié" — saisie de l'email.
 *
 * Changements vs v14 :
 * - standalone: true
 * - inject() + signal()
 * - Champ renommé 'mail' → 'email' (aligné backend)
 * - UserService.resetPassword() → AuthService.forgotPassword()
 *   (route POST /api/auth/forgot-password au lieu de POST /api/v1/mails/:mail/password)
 * - Timeout réduit à 8s (15s était trop long)
 * - OnDestroy conservé pour nettoyer le timeout
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  private timeoutID!: ReturnType<typeof setTimeout>;

  // Champ renommé 'email' (était 'mail')
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() { return this.form.get('email'); }

  ngOnInit() {
    // Le FormGroup est initialisé directement en propriété de classe
    // plus besoin de ngOnInit pour ça — conservé pour compatibilité si le
    // template utilise une logique d'initialisation tardive
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutID);
  }

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);

    this.authService
      .forgotPassword({ email: this.form.value.email! })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'info',
            detail:
              'Si cette adresse email est bien associée à un compte, vous allez recevoir un lien de réinitialisation.',
          });
          // Redirection automatique vers la connexion après 8s
          this.timeoutID = setTimeout(
            () => this.router.navigate(['authentication/connexion']),
            8000
          );
        },
        error: () => {
          // Le backend retourne toujours 200 même si l'email n'existe pas
          // Une erreur ici est donc une erreur réseau ou serveur
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            detail: 'Une erreur est survenue. Veuillez réessayer plus tard.',
          });
        },
      });
  }
}