import { StepsModule } from 'primeng/steps';
import { CoreRoutes } from './core.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {AccueilComponent } from './page/accueil/accueil.component';
import {EtapesInscriptionComponent } from './components/etapes-inscription/etapes-inscription.component';
@NgModule({
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    CoreRoutes,
    StepsModule
  ],
  exports:[
    HeaderComponent,
    AccueilComponent,
    EtapesInscriptionComponent
  ],
  declarations: [HeaderComponent, AccueilComponent,EtapesInscriptionComponent],
})
export class CoreModule { }
