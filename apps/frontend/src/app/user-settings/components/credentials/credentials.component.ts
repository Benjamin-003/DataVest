import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UniqueEmailValidator } from '../../../core/auth/unique-email.validator';
import { UpdateProfilePayload, ChangePasswordPayload } from '../../../core/models/auth.models';

/**
 * Changements vs v14 :
 * - standalone: true, inject()
 * - Champ 'mail' → 'email' (aligné backend + HTML)
 * - UniqueMailValidator → UniqueEmailValidator (nouvelle classe, nouvel endpoint)
 *   currentMail → currentEmail
 * - Payload mot de passe : { old_password, new_password } → ChangePasswordPayload
 *   { currentPassword, newPassword } (aligné backend PATCH /api/auth/password)
 * - Output emailEvent émet UpdateProfilePayload { email }
 * - Output passwordEvent émet ChangePasswordPayload
 */
@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './credentials.component.html',
})
export class CredentialsComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly uniqueEmailValidator = inject(UniqueEmailValidator);

  @Input() userEmail!: string;
  @Output() modifyEmail    = new EventEmitter<UpdateProfilePayload>();
  @Output() modifyPassword = new EventEmitter<ChangePasswordPayload>();

  emailForm    = this.fb.group({ email: [''] });
  passwordForm = this.fb.group({
    currentPassword: [''],
    newPassword:     [''],
    confirmPassword: [''],
  });

  get email()           { return this.emailForm.get('email'); }
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword()     { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  ngOnInit() {
    this.initPasswordForm();
  }

  
  ngOnChanges(changes: SimpleChanges) {
  if (changes['userEmail']) {
    this.uniqueEmailValidator.currentEmail = changes['userEmail'].currentValue as string;
    this.initEmailForm(changes['userEmail'].currentValue as string);
  }
}

  initEmailForm(email: string) {
    this.emailForm = this.fb.group(
      {
        email: [
          email,
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [
  (control: AbstractControl) => 
    this.uniqueEmailValidator.validate(control) as ReturnType<AsyncValidatorFn>
] as AsyncValidatorFn[],
            updateOn: 'blur',
          },
        ],
      },
      { validators: this.noChangeValidator() }
    );
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword:     ['', [Validators.required, Validators.minLength(12)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [this.matchingPasswordsValidator] }
    );
  }

  /** Bloque le submit si l'email n'a pas changé */
  private noChangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>
      control.get('email')?.value === this.userEmail ? { noChangeValues: true } : null;
  }

  private matchingPasswordsValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const newPwd     = control.get('newPassword')?.value;
    const confirmPwd = control.get('confirmPassword')?.value;
    return newPwd === confirmPwd ? null : { notmatched: true };
  };

  saveEmail() {
    if (this.emailForm.valid) {
      this.modifyEmail.emit({ email: this.emailForm.value.email! });
    }
  }

 savePassword() {
  if (this.passwordForm.invalid) return;
  const payload: ChangePasswordPayload = {
    currentPassword: this.currentPassword!.value ?? '',
    newPassword:     this.newPassword!.value     ?? '',
  };
  this.modifyPassword.emit(payload);
}
}