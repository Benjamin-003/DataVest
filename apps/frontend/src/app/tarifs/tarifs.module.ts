import { TarifsRoutes } from './tarifs.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarifsComponent } from './composants/tarifs/tarifs.component';
import { CardModule, } from 'primeng/card';
@NgModule({
  imports: [
    CommonModule,
    TarifsRoutes,
    CardModule
  ],
  exports:[
    TarifsComponent
  ],
  declarations: [TarifsComponent]
})
export class TarifsModule { }
