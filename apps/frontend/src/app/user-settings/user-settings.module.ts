import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingsRoutingModule } from './user-settings-routing.module';


@NgModule({
  declarations: [
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule
  ],
  exports:[
    UserSettingsComponent
  ]
})
export class UserSettingsModule { }
