import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public items!: MenuItem[]
  ngOnInit() {
    this.items = [{ label: "Tarif", routerLink: "tarifs" }, { label: "Investir", routerLink: "investissement" }, { label: "Académie" }, { label: "A propos de SVB Ind",
    items: [{ label: "À propos d'Ottawa Pigeon" }, { label: "Centre d'aide" }, { label: "Pourquoi nous choisir ?" }] },
    { label: "Des questions" }];
  }
}
