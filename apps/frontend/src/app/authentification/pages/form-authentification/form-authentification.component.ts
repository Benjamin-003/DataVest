import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * Formulaire de connexion — étape 1 du flow 2FA.
 *
 * Changements vs v14 :
 * - standalone: true (plus de AuthentificationModule)
 * - inject() au lieu du constructeur
 * - signal() pour l'état de chargement
 * - Sur succès → redirection /authentication/2fa (nouveau)
 *   au lieu de redirection directe dashboard (impossible sans 2FA)
 * - Champ 'mail' renommé 'email' pour correspondre au backend
 */
@Component({
    selector: 'app-form-authentification',
    imports: [ReactiveFormsModule, ButtonModule, PasswordModule, InputTextModule, ToastModule],
    providers: [MessageService],
    templateUrl: './form-authentification.component.html'
})
export class FormAuthentificationComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    this.authService
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          // Le backend a envoyé le code 2FA par email
          // AuthService a stocké l'email dans pendingEmail()
          this.router.navigate(['/authentication/2fa']);
        },
        error: () => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Email et/ou mot de passe incorrect',
          });
        },
      });
  }
}