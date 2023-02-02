import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  get birthdate() { return this.formulaire.get('birthdate'); }

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
      birthdate: [
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
    })
  }

  //On emet les données au composant parent
  saveModification() {
    if (this.formulaire.valid) {
      this.modificationEvent.emit(this.formulaire.value)
    }
  }
}
