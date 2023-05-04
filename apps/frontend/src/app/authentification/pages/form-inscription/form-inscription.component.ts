
import { Subscription } from '../../../subscriptions/subscription.model';
import { UniqueMailValidator } from './../../services/unique-mail-validator';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-inscription',
  templateUrl: './form-inscription.component.html'
})
export class FormInscriptionComponent implements OnChanges {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly uniqueMail: UniqueMailValidator,
    private readonly route: ActivatedRoute
  ) { }

  public formulaire!: FormGroup;
  public messagesErreur = [
    "Il semble y avoir une erreur de saisie ici",
    "Ce champ est obligatoire, merci de saisir l'information demandée",
    "Un compte est déjà associé à cette adresse email",
  ]

  /**
   * Expression régulière pour détecter un mot de passe dit "fort".
   *
   * Un mot de passe est "fort" lorsqu'il contient :
   * - au moins une lettre minuscule
   * - au moins une lettre majuscule
   * - au moins un chiffre
   * - au moins un caractère spécial
   * - au moins 8 caractères
   *
   * Les caractères spéciaux sont issus de :
   *
   * https://en.wikipedia.org/wiki/List_of_Special_Characters_for_Passwords
   *
   * À l'exception du caractère "espace" (décimal 32).
   */
  public readonly strongPasswordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-\/:-@[-`{-~])[a-zA-Z0-9!-\/:-@[-`{-~]{8,}$";
  @Input() subscriptions!: Subscription[];
  @Input() defaultBackOption!: string;
  @Output() submitForm = new EventEmitter();
  public selectedOptionCode!: string

  //on utilise des getters pour acceder aux valeurs saisie dans le formulaire
  get surname() { return this.formulaire?.get('surname'); }

  get firstname() { return this.formulaire?.get('firstname'); }

  get birth_date() { return this.formulaire?.get('birth_date'); }

  get address() { return this.formulaire?.get('address'); }

  get zip_code() { return this.formulaire?.get('zip_code'); }

  get city() { return this.formulaire?.get('city'); }

  get country() { return this.formulaire?.get('country'); }

  get mail() { return this.formulaire?.get('mail'); }

  get password() { return this.formulaire?.get('password'); }

  get confirmPassword() { return this.formulaire?.get('confirmPassword'); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultBackOption']) {
      this.selectedOptionCode = this.route.snapshot.paramMap.get('option')
        ? this.route.snapshot.paramMap.get('option') :
        changes['defaultBackOption'].currentValue
      this.initForm()
    }
  }

  initForm() {
    this.formulaire = this.formBuilder.group({
      surname: [
        "",
        [
          Validators.required
        ],
      ],
      firstname: [
        "",
        [
          Validators.required,
        ],
      ],
      birth_date: ["", Validators.required],
      address: ["", Validators.required],
      zip_code: ["", Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
      mail: [
        "",
        {
          validators: [
            Validators.required,
            Validators.email
          ],
          asyncValidators: [
            this.uniqueMail.validate.bind(this.uniqueMail),
          ] as AsyncValidatorFn[],
          updateOn: 'blur',
        }
      ],
      password: [
        "",
        [
          Validators.required
        ],
      ],
      confirmPassword: [
        "",
        [
          Validators.required
          ,
        ],
      ],
      subscription_code: [
        this.selectedOptionCode, [Validators.required]
      ],
      newsletter: [false],
    }, { validators: [this.validationMatchingPassword] })
  }

  //Vérification si le mot de passe de confirmation match avec le champs de mot de passe .
  validationMatchingPassword: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
    const password = controle.get('password');
    const confirmPassword = controle.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  }

  //On soumet le formulaire et on redirige vers la page de succès ou d'échec
  validationForm() {
    if (this.formulaire.valid) {
      const { confirmPassword, birth_date, ...user } = this.formulaire.value
      //On transforme l'objet Date en chaine de caractère au format ISO
      user.birth_date = birth_date.toISOString()
      this.submitForm.emit(user)
    }
  }
}
