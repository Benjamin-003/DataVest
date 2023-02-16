import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import { CredentialsComponent } from './components/credentials/credentials.component';
import { OtherSettingsComponent } from './components/other-settings/other-settings.component';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from "primeng/divider";
import {DropdownModule} from 'primeng/dropdown';
@NgModule({
  declarations: [
    UserSettingsComponent,
    PersonalDataComponent,
    CredentialsComponent,
    OtherSettingsComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    UserSettingsRoutingModule,
    CalendarModule,
    ReactiveFormsModule,
    ToastModule,
    PasswordModule,
    DividerModule,
    DropdownModule
  ],
  exports: [
    UserSettingsComponent,
    PersonalDataComponent
  ]
})
export class UserSettingsModule { }
