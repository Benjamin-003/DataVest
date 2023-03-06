import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-preambule-inscription',
  templateUrl: './preambule-inscription.component.html'
})
export class PreambuleInscriptionComponent implements OnInit {

  constructor(private readonly primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
