import { UserService } from 'src/app/users/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  providers: [MessageService],
})
export class ResetPasswordFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) { }
  public resetPasswordForm!: FormGroup;
  public userToken!: string | null;
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }
  public readonly strongPasswordRegex =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-/:-@[-`{-~])[a-zA-Z0-9!-/:-@[-`{-~]{8,}$';
  public messagesErreur = [
    'Il semble y avoir une erreur de saisie ici',
    "Ce champ est obligatoire, merci de saisir l'information demandée",
  ];

  ngOnInit() {
    this.userToken = this.route.snapshot.paramMap.get('token');
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.validationMatchingPassword] }
    );
  }

  //Vérification si le mot de passe de confirmation match avec le champs de nouveau mot de passe .
  validationMatchingPassword: ValidatorFn = (
    controle: AbstractControl
  ): ValidationErrors | null => {
    const newPassword = controle.get('newPassword');
    const confirmPassword = controle.get('confirmPassword');
    return newPassword?.value === confirmPassword?.value
      ? null
      : { notmatched: true };
  };
  saveNewPassword() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const userID = this.userService.getIDIntoRefreshToken(this.userToken);
      if (userID && this.userToken) {
        this.userService
          .updatePasswordWithoutLogin({ new_password: newPassword }, userID, this.userToken)
          .subscribe({
            error: () => {
              this.messageService.add({
                severity: 'error',
                detail:
                  'Désolé, une erreur est survenue. Veuillez réessayer plus tard',
              });
            },
            complete: () => {
              this.messageService.add({
                severity: 'success',
                detail:
                  'Votre mot de passe a bien été mis à jour. Vous allez être redirigé dans un instant',
              });
              setTimeout(
                () => this.router.navigate(['authentication/connexion']),
                3000
              );
            },
          });
      }
    }
  }
}

