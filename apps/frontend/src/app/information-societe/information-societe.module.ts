import { AProposOttawaPigeonComponent } from './a-propos-ottawa-pigeon/a-propos-ottawa-pigeon.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { InformationSocieteRoutingModule } from './information-societe-routing.module';
import {CarouselModule} from 'primeng/carousel';

@NgModule({
  declarations: [
    AProposOttawaPigeonComponent
  ],
  imports: [
    CommonModule,
    InformationSocieteRoutingModule,
    PanelModule,
    CarouselModule
  ]
})
export class InformationSocieteModule { }
