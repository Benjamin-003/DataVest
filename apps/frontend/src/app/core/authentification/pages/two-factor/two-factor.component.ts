import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, ToastModule, CardModule],
  providers: [MessageService],
  template: `
    <p-toast position="bottom-right"></p-toast>
    <div class="grid mt-5 mx-2 p-fluid">
      <div class="col-12 lg:col-offset-4 lg:col-4 shadow-2 bg-primary-300">
        <p-card>
          <div class="text-center mb-4">
            <h2>Vérification en deux étapes</h2>
            <p class="text-color-secondary">
              Un code à 6 chiffres a été envoyé à<br>
              <strong>{{ authService.pendingEmail() }}</strong>
            </p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field mb-4">
              <span class="p-float-label">
                <input
                  id="code"
                  type="text"
                  pInputText
                  formControlName="code"
                  maxlength="6"
                  class="w-full text-center"
                  style="letter-spacing: 0.5rem; font-size: 1.5rem;"
                />
                <label for="code">Code à 6 chiffres</label>
              </span>
              @if (form.get('code')?.touched && form.get('code')?.invalid) {
                <div class="p-error mt-1">
                  <small>Veuillez saisir le code à 6 chiffres reçu par email</small>
                </div>
              }
            </div>

            <div class="flex flex-column gap-2">
              <button
                pButton pRipple
                type="submit"
                label="Valider"
                [loading]="loading()"
                [disabled]="form.invalid"
                class="p-button-raised w-full">
              </button>
              <button
                pButton
                type="button"
                label="← Retour à la connexion"
                class="p-button-text w-full"
                (click)="goBack()">
              </button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
})
export class TwoFactorComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) return;

    const email = this.authService.pendingEmail();
    if (!email) {
      this.router.navigate(['/authentication/connexion']);
      return;
    }

    this.loading.set(true);

    this.authService
      .verifyTwoFactor({ email, code: this.form.value.code! })
      .subscribe({
        next: () => this.router.navigate(['/dashboard/macroeconomicnews']),
        error: () => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Code invalide',
            detail: 'Le code saisi est incorrect ou expiré. Veuillez réessayer.',
          });
          this.form.reset();
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/authentication/connexion']);
  }
}