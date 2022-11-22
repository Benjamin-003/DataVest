import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationSocieteRoutingModule } from './information-societe-routing.module';
import { InformationSocieteComponent } from './information-societe.component';


@NgModule({
  declarations: [
    InformationSocieteComponent
  ],
  imports: [
    CommonModule,
    InformationSocieteRoutingModule
  ]
})
export class InformationSocieteModule { }
