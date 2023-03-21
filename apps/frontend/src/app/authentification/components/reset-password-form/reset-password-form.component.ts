import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html'
})
export class ResetPasswordFormComponent implements OnInit {

  constructor(private readonly formBuilder: FormBuilder) { }
  public resetPasswordForm!: FormGroup;
  get newPassword() { return this.resetPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }
  public readonly strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-\/:-@[-`{-~])[a-zA-Z0-9!-\/:-@[-`{-~]{8,}$"
  public messagesErreur = [
    "Il semble y avoir une erreur de saisie ici",
    "Ce champ est obligatoire, merci de saisir l'information demandée"
  ];
  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ["",
        [
          Validators.required
        ],
      ],
      confirmPassword: ["",
        [
          Validators.required
        ],
      ],
    }, { validators: [this.validationMatchingPassword] }
    )
  }

  //Vérification si le mot de passe de confirmation match avec le champs de nouveau mot de passe .
  validationMatchingPassword: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
    const newPassword = controle.get('newPassword');
    const confirmPassword = controle.get('confirmPassword');
    return newPassword?.value === confirmPassword?.value ? null : { notmatched: true };
  }
  saveNewPassword(){
    // On transmettera le mot de passe dans la méthode d'appel de back
  }
}
