import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Password } from './../../../users/interfaces/password.model';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UniqueMailValidator } from 'src/app/authentification/services/unique-mail-validator';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html'
})
export class CredentialsComponent implements OnInit, OnChanges {
  @Input() userMail!: string;
  @Output("modifyEmail") emailEvent = new EventEmitter();
  @Output("modifyPassword") passwordEvent = new EventEmitter();
  public emailForm!: FormGroup;
  public passwordForm!: FormGroup;
  get mail() { return this.emailForm.get('mail'); }
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
  public readonly strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-\/:-@[-`{-~])[a-zA-Z0-9!-\/:-@[-`{-~]{8,}$"
  public messagesErreur = [
    "Il semble y avoir une erreur de saisie ici",
    "Ce champ est obligatoire, merci de saisir l'information demandée"
  ];

  constructor(private readonly formBuilder: FormBuilder, private readonly uniqueMail: UniqueMailValidator) { }

  ngOnInit() {
    this.uniqueMail.currentMail = this.userMail;
    this.initPasswordForm()
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges["userMail"]) {
      this.initMailForm(simpleChanges["userMail"].currentValue)
    }
  }

  initMailForm(email: string) {
    this.emailForm = this.formBuilder.group({
      mail: [
        email,
        {
          validators: [
            Validators.required,
            Validators.email
          ],
          asyncValidators: [
            this.uniqueMail.validate.bind(this.uniqueMail)
          ] as AsyncValidatorFn[],
          updateOn: 'change',
        }
      ]
    }, { validators: this.noChangeValuesValidator() }
    )
  }

  initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ["",
        [
          Validators.required
        ],
      ],
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

  noChangeValuesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('mail')?.value === this.userMail
        ? { noChangeValues: true } : null;
    };
  }

  //Vérification si le mot de passe de confirmation match avec le champs de nouveau mot de passe .
  validationMatchingPassword: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
    const newPassword = controle.get('newPassword');
    const confirmPassword = controle.get('confirmPassword');
    return newPassword?.value === confirmPassword?.value ? null : { notmatched: true };
  }

  saveMail() {
    if(this.emailForm.valid)
    this.emailEvent.emit(this.emailForm.value as PersonalData)
  }

  savePassword() {
    if(this.passwordForm.valid){
      const password: Password = { old_password: this.currentPassword?.value, new_password: this.newPassword?.value }
      this.passwordEvent.emit(password)
    }
  }
}
