import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
 
@Component({
  selector: 'app-echec-inscription',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './echec-inscription.component.html',
})
export class EchecInscriptionComponent {}
