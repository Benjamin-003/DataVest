import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

/**
 * PrimeNGConfig a été supprimé de primeng/api en PrimeNG 19.
 * Le ripple est maintenant activé globalement via providePrimeNG()
 * dans app.config.ts — plus besoin de l'activer composant par composant.
 */
@Component({
  selector: 'app-preambule-inscription',
  standalone: true,
  imports: [RouterModule, ButtonModule, RippleModule],
  templateUrl: './preambule-inscription.component.html',
})
export class PreambuleInscriptionComponent {}