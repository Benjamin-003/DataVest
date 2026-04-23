import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule, CardModule],
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

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() { return this.form.get('email'); }

  ngOnInit() {}

  ngOnDestroy() { clearTimeout(this.timeoutID); }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.authService.forgotPassword({ email: this.form.value.email! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'info', detail: 'Si cette adresse email est bien associée à un compte, vous allez recevoir un lien de réinitialisation.' });
        this.timeoutID = setTimeout(() => this.router.navigate(['authentication/connexion']), 8000);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', detail: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
      },
    });
  }
}