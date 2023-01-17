import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule
  ]
})
export class UserSettingsModule { }
