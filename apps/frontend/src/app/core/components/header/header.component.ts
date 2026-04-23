import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public items!: MenuItem[];

  readonly isLogged = this.authService.isLoggedIn;
  readonly loggedUserName = computed(() => this.authService.user()?.firstName ?? '');

  ngOnInit() {
    this.items = [
      { label: $localize`:@@header.price:Tarif`, routerLink: 'tarifs' },
      { label: $localize`:@@header.invest:Investir`, routerLink: 'investissement' },
      { label: $localize`:@@header.academy:Académie` },
      {
        label: $localize`:@@header.aboutSVBInd:À propos de SVB Ind`,
        items: [
          {
            label: $localize`:@@header.aboutOttawaPigeon:À propos d'Ottawa Pigeon`,
            routerLink: 'information-societe/apropos',
          },
          { label: $localize`:@@header.helpCenter:Centre d'aide` },
          { label: $localize`:@@header.whyChooseUs:Pourquoi nous choisir ?` },
        ],
      },
      { label: $localize`:@@header.anyQuestions:Des questions ?` },
    ];
  }

  logOffUser() {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/accueil']),
      error:    () => this.router.navigate(['/accueil']),
    });
  }
}