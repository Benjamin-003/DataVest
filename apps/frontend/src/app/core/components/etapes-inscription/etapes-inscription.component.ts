import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-etapes-inscription',
  templateUrl: './etapes-inscription.component.html'
})
export class EtapesInscriptionComponent{
  @Input() label: MenuItem[] = []
}
