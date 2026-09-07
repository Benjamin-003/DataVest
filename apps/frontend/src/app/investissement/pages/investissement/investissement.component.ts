import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-investissement',
  standalone: true,
  imports: [RouterModule, CardModule],
  templateUrl: './investissement.component.html',
})
export class InvestissementComponent {}
