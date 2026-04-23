import { CoreRoutes } from './core.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AccueilComponent } from './page/accueil/accueil.component';
import { EtapesInscriptionComponent } from './components/etapes-inscription/etapes-inscription.component';

/**
 * CoreModule — module hybride pendant la transition vers standalone.
 * AccueilComponent reste déclaré ici (pas encore migré).
 * EtapesInscriptionComponent est standalone → importé, pas déclaré.
 */
@NgModule({
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    CoreRoutes,
    EtapesInscriptionComponent,  // standalone → import
  ],
  declarations: [
    AccueilComponent,            // pas encore standalone → declare
  ],
  exports: [
    AccueilComponent,
    EtapesInscriptionComponent,
  ],
})
export class CoreModule {}
