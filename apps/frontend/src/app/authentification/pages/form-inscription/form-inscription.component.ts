import { UniqueMailValidator } from './../../services/unique-mail-validator';
import { UserService } from './../../services/user-service.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-inscription',
  templateUrl: './form-inscription.component.html'
})
export class FormInscriptionComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly inscription: UserService,
    private readonly uniqueMail: UniqueMailValidator,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  public formulaire!: FormGroup;
  public messagesErreur = [
    "Il semble y avoir une erreur de saisie ici",
    "Ce champ est obligatoire, merci de saisir l'information demandée",
    "Un compte est déjà associé à cette adresse email",
  ]

  //Cette Regex vient du site https://www.emailregex.com/
  public mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  ngOnInit(): void {
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
            Validators.pattern(this.mailRegex),
          ],
          asyncValidators: [
            this.uniqueMail.validate.bind(this.uniqueMail),
          ],
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
      const { confirmPassword, ...user } = this.formulaire.value
      this.inscription.createUser(user).subscribe({
        error: () => {
          this.router.navigate(['../echec'], { relativeTo: this.route }).then();
        },
        complete: () => {
          this.router.navigate(['../succes'], { relativeTo: this.route }).then();
        }
      })
    }
  }
}
