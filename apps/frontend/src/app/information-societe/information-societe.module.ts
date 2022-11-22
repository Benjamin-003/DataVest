import { AProposOttawaPigeonComponent } from './a-propos-ottawa-pigeon/a-propos-ottawa-pigeon.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationSocieteRoutingModule } from './information-societe-routing.module';


@NgModule({
  declarations: [
    AProposOttawaPigeonComponent
  ],
  imports: [
    CommonModule,
    InformationSocieteRoutingModule
  ]
})
export class InformationSocieteModule { }
