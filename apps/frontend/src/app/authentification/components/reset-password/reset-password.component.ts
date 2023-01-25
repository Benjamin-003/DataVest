import { MessageService } from 'primeng/api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit, OnDestroy{
  formulaire!: FormGroup;
  displayDialog: boolean = false;
  private timeoutID!:ReturnType<typeof setTimeout>
  constructor(private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private messageService: MessageService) { }

  ngOnInit() {

    this.formulaire = this.formBuilder.group({
      mail: [
        "",
        [
          Validators.required,
          Validators.email
        ],
      ]
    })
  }

ngOnDestroy(){
  clearTimeout(this.timeoutID)
}

  //Permet d'envoyer le mail au back et déclenche l'affichage de la popup
  validationResetPassword() {
    if (this.formulaire.valid) {
      this.messageService.add({ severity: 'info', detail: 'Si cette adresse email est bien associée à un compte, vous allez recevoir un mail avec votre nouveau mot de passe' });
      this.timeoutID = setTimeout(() => {
        this.router.navigate(['authentification/connexion']);
      }, 15000)
    }
  }
}
