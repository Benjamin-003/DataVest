import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-succes-inscription',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './succes-inscription.component.html',
})
export class SuccesInscriptionComponent {}