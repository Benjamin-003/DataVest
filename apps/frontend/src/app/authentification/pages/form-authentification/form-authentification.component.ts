import { Credentials } from '../../Interfaces/credentials.model';
import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-authentification',
  templateUrl: './form-authentification.component.html'
})
export class FormAuthentificationComponent implements OnInit {
  @Output() newConnexionEvent = new EventEmitter();
  constructor(
    private readonly formBuilder: FormBuilder
  ) { }

  public formulaire!: FormGroup;

  get mail() { return this.formulaire.get('mail'); }

  get password() { return this.formulaire.get('password'); }

  ngOnInit(): void {
    this.formulaire = this.formBuilder.group({
      mail: [
        "",
        [
          Validators.required
        ],
      ],
      password: [
        "",
        [
          Validators.required,
        ],
      ]
    })
  }

  //Cette méthode envoie les identifiants au composant parent
  validationSignIn() {
    const credentials: Credentials = {
      mail: this.mail?.value,
      password: this.password?.value
    }
    this.newConnexionEvent.emit(credentials)
  }
}
