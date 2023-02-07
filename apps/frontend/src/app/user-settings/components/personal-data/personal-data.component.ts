import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html'
})
export class PersonalDataComponent implements OnInit {

  @Input() personalData!: PersonalData
  @Output() modificationEvent = new EventEmitter();
  public formulaire!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) { }

  get surname() { return this.formulaire.get('surname'); }

  get firstname() { return this.formulaire.get('firstname'); }

  get birth_date() { return this.formulaire.get('birth_date'); }

  get address() { return this.formulaire.get('address'); }

  get zip_code() { return this.formulaire.get('zip_code'); }

  get city() { return this.formulaire.get('city'); }

  get country() { return this.formulaire.get('country'); }

  public messagesErreur = "Ce champ est obligatoire, merci de saisir l'information demandée"

  ngOnInit() {
    this.formulaire = this.formBuilder.group({
      surname: [
        this.personalData.surname,
        [
          Validators.required
        ],
      ],
      firstname: [
        this.personalData.firstname,
        [
          Validators.required,
        ],
      ],
      birth_date: [
        new Date(this.personalData.birth_date),
        [
          Validators.required
        ]
      ],
      address: [
        this.personalData.address,
        [
          Validators.required
        ]
      ],
      zip_code: [
        this.personalData.zip_code,
        [
          Validators.required
        ]
      ],
      city: [
        this.personalData.city,
        [
          Validators.required
        ]
      ],
      country: [
        this.personalData.country,
        [
          Validators.required
        ]
      ]
    },{validators:[this.noChangeValuesValidator(this.personalData)]})
  }

  noChangeValuesValidator(personalData: PersonalData): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const surname = control.get('surname');
      const firstname = control.get('firstname');
      const birth_date = control.get('birth_date');
      const address = control.get('address');
      const zip_code = control.get('zip_code');
      const city = control.get('city');
      const country = control.get('country');
      return surname?.value === personalData.surname
        && firstname?.value === personalData.firstname
        && birth_date?.value.toISOString() === personalData.birth_date
        && address?.value === personalData.address
        && zip_code?.value === personalData.zip_code
        && city?.value === personalData.city
        && country?.value === personalData.country
        ? { noChangeValues: true } : null;
    };
  }
  //On emet les données au composant parent
  saveModification() {
    if (this.formulaire.valid) {
      this.formulaire.value.birth_date = this.formulaire.value.birth_date.toISOString()
      this.modificationEvent.emit(this.formulaire.value)
    }
  }
}
