import { CoreRoutes } from './core.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {AccueilComponent } from './page/accueil/accueil.component';
@NgModule({
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    CoreRoutes
  ],
  exports:[
    HeaderComponent,
    AccueilComponent
  ],
  declarations: [HeaderComponent, AccueilComponent],
})
export class CoreModule { }
