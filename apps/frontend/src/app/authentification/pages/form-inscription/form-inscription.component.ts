import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { UniqueEmailValidator } from '../../../core/auth/unique-email.validator';
import { RegisterPayload } from '../../../core/models/auth.models';
import { Subscription } from '../../../subscriptions/subscription.model';

@Component({
  selector: 'app-form-inscription',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, PasswordModule, DatePickerModule,
    SelectModule, CheckboxModule, DividerModule,
    ButtonModule, RippleModule, CardModule,
  ],
  templateUrl: './form-inscription.component.html',
})
export class FormInscriptionComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly uniqueEmailValidator = inject(UniqueEmailValidator);
  private readonly route = inject(ActivatedRoute);

  @Input() subscriptions!: Subscription[];
  @Input() defaultBackOption!: string;
  @Output() submitForm = new EventEmitter<RegisterPayload>();

  public selectedOptionCode!: string;

  public readonly messagesErreur = [
    'Il semble y avoir une erreur de saisie ici',
    "Ce champ est obligatoire, merci de saisir l'information demandée",
    'Un compte est déjà associé à cette adresse email',
  ];

  public readonly strongPasswordRegex =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-\\/:-@[-`{-~])[a-zA-Z0-9!-\\/:-@[-`{-~]{12,}$';

  private readonly matchingPasswordsValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const pwd     = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pwd === confirm ? null : { notmatched: true };
  };

  formulaire = this.buildForm();

  get lastName()        { return this.formulaire.get('lastName'); }
  get firstName()       { return this.formulaire.get('firstName'); }
  get birthdate()       { return this.formulaire.get('birthdate'); }
  get address()         { return this.formulaire.get('address'); }
  get zipcode()         { return this.formulaire.get('zipcode'); }
  get city()            { return this.formulaire.get('city'); }
  get country()         { return this.formulaire.get('country'); }
  get email()           { return this.formulaire.get('email'); }
  get password()        { return this.formulaire.get('password'); }
  get confirmPassword() { return this.formulaire.get('confirmPassword'); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultBackOption']) {
      const option = this.route.snapshot.paramMap.get('option');
      this.selectedOptionCode = option ?? (changes['defaultBackOption'].currentValue as string);
      this.formulaire = this.buildForm();
    }
  }

  private buildForm() {
    this.uniqueEmailValidator.currentEmail = '';
    return this.fb.group(
      {
        lastName:         ['', Validators.required],
        firstName:        ['', Validators.required],
        birthdate:        ['', Validators.required],
        address:          ['', Validators.required],
        zipcode:          ['', Validators.required],
        city:             ['', Validators.required],
        country:          ['', Validators.required],
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [
              (control: AbstractControl) =>
                this.uniqueEmailValidator.validate(control) as ReturnType<AsyncValidatorFn>,
            ],
            updateOn: 'blur',
          },
        ],
        password:         ['', [Validators.required, Validators.minLength(12)]],
        confirmPassword:  ['', Validators.required],
        subscriptionCode: [this.selectedOptionCode ?? '', Validators.required],
        newsletter:       [false],
      },
      { validators: [this.matchingPasswordsValidator] }
    );
  }

  validationForm() {
    if (this.formulaire.invalid) return;

    const raw = this.formulaire.value as {
      lastName?: string | null;
      firstName?: string | null;
      birthdate?: Date | string | null;
      address?: string | null;
      zipcode?: string | null;
      city?: string | null;
      country?: string | null;
      email?: string | null;
      password?: string | null;
      confirmPassword?: string | null;
      subscriptionCode?: string | null;
      newsletter?: boolean | null;
    };

    const { confirmPassword: _confirm, birthdate, ...rest } = raw;

    const payload: RegisterPayload = {
      email:            rest.email            ?? '',
      password:         rest.password         ?? '',
      lastName:         rest.lastName         ?? undefined,
      firstName:        rest.firstName        ?? undefined,
      address:          rest.address          ?? undefined,
      zipcode:          rest.zipcode          ?? undefined,
      city:             rest.city             ?? undefined,
      country:          rest.country          ?? undefined,
      subscriptionCode: rest.subscriptionCode ?? undefined,
      newsletter:       rest.newsletter       ?? false,
      birthdate: birthdate instanceof Date
        ? birthdate.toISOString()
        : String(birthdate ?? ''),
    };

    this.submitForm.emit(payload);
  }
}