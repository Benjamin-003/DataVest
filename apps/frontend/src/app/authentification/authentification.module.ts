import { SuccesInscriptionComponent } from './pages/succes-inscription/succes-inscription.component';
import { EchecInscriptionComponent } from './pages/echec-inscription/echec-inscription.component';
import { CoreModule } from './../core/core.module';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { AuthentificationRoutes } from './authentification.routing';
import { PreambuleInscriptionComponent } from './pages/preambule-inscription/preambule-inscription.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInscriptionComponent } from './pages/form-inscription/form-inscription.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule, } from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule } from 'primeng/checkbox';
import {PasswordModule } from "primeng/password";
import { DividerModule } from "primeng/divider";
@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    AuthentificationRoutes,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CoreModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    DividerModule
  ],
  exports:[
    FormInscriptionComponent,
    PreambuleInscriptionComponent,
    AuthentificationComponent,
    InscriptionComponent,
    FormInscriptionComponent,
    EchecInscriptionComponent,
    SuccesInscriptionComponent
  ],
  declarations: [
    FormInscriptionComponent,
    PreambuleInscriptionComponent,
    AuthentificationComponent,
    InscriptionComponent,
    FormInscriptionComponent,
    EchecInscriptionComponent,
    SuccesInscriptionComponent
  ]
})
export class AuthentificationModule { }
