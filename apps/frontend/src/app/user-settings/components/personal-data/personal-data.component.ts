import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html'
})
export class PersonalDataComponent implements OnChanges {

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

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges["personalData"]) {
      this.initForm(simpleChanges["personalData"].currentValue)
    }
  }

  initForm(personalData: PersonalData) {
    this.formulaire = this.formBuilder.group({
      surname: [
        personalData.surname,
        [
          Validators.required
        ],
      ],
      firstname: [
        personalData.firstname,
        [
          Validators.required,
        ],
      ],
      birth_date: [
        new Date(+personalData.birth_date.substring(0, 4), +personalData.birth_date.substring(5, 7) - 1, +personalData.birth_date.substring(8)),
        [
          Validators.required
        ]
      ],
      address: [
        personalData.address,
        [
          Validators.required
        ]
      ],
      zip_code: [
        personalData.zip_code,
        [
          Validators.required
        ]
      ],
      city: [
        personalData.city,
        [
          Validators.required
        ]
      ],
      country: [
        personalData.country,
        [
          Validators.required
        ]
      ]
    }, { validators: [this.noChangeValuesValidator(personalData)] })
  }

  noChangeValuesValidator(personalData: PersonalData): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const surname = control.get('surname');
      const firstname = control.get('firstname');
      const birthDate = control.get('birth_date');
      const address = control.get('address');
      const zipCode = control.get('zip_code');
      const city = control.get('city');
      const country = control.get('country');
      return surname?.value === personalData.surname
        && firstname?.value === personalData.firstname
        && this.dateToString(birthDate?.value) === personalData.birth_date
        && address?.value === personalData.address
        && zipCode?.value === personalData.zip_code
        && city?.value === personalData.city
        && country?.value === personalData.country
        ? { noChangeValues: true } : null;
    };
  }

  dateToString(date: Date): string {
    const day: string = date.getDate().toString().padStart(2, "0")
    const month: string = (date.getMonth() + 1).toString().padStart(2, "0")
    const year: string = date.getFullYear().toString()
    return `${year}-${month}-${day}`
  }

  //On emet les données au composant parent
  saveModification() {
    if (this.formulaire.valid) {
      this.formulaire.value.birth_date = this.dateToString(this.formulaire.value.birth_date)
      this.modificationEvent.emit(this.formulaire.value)
    }
  }
}
