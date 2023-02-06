import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    UserSettingsComponent,
    PersonalDataComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    UserSettingsRoutingModule,
    CalendarModule,
    ReactiveFormsModule,
    ToastModule
  ],
  exports: [
    UserSettingsComponent,
    PersonalDataComponent
  ]
})
export class UserSettingsModule { }
