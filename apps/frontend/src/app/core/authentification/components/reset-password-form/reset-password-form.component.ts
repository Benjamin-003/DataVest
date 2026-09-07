import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordModule, ButtonModule, ToastModule, CardModule, DividerModule],
  providers: [MessageService],
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  private resetToken!: string;

  private readonly matchingPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const a = control.get('newPassword')?.value;
    const b = control.get('confirmPassword')?.value;
    return a === b ? null : { notmatched: true };
  };

  readonly form = this.fb.group(
    {
      newPassword:     ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [this.matchingPasswordsValidator] }
  );

  get newPassword()     { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  ngOnInit() {
    this.resetToken = this.route.snapshot.paramMap.get('token')!;
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.authService.resetPassword({ token: this.resetToken, newPassword: this.form.value.newPassword! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'success', detail: 'Votre mot de passe a bien été mis à jour. Vous allez être redirigé dans un instant.' });
        setTimeout(() => this.router.navigate(['authentication/connexion']), 3000);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', detail: 'Ce lien est invalide ou expiré. Veuillez refaire une demande de réinitialisation.' });
      },
    });
  }
}