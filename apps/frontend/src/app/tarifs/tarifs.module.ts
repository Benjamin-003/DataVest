import { TarifsRoutes } from './tarifs.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarifsComponent } from './composants/tarifs/tarifs.component';
import { CardModule, } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@NgModule({
  imports: [
    CommonModule,
    TarifsRoutes,
    CardModule,
    ButtonModule
  ],
  exports:[
    TarifsComponent
  ],
  declarations: [TarifsComponent]
})
export class TarifsModule { }
