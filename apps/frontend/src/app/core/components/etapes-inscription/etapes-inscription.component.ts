import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-etapes-inscription',
  standalone: true,
  imports: [StepsModule],
  templateUrl: './etapes-inscription.component.html',
})
export class EtapesInscriptionComponent {
  @Input() label: MenuItem[] = [];
}