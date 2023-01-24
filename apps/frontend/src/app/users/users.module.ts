import { UserService } from './services/user-service.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    UserService
  ],
})
export class UsersModule { }
