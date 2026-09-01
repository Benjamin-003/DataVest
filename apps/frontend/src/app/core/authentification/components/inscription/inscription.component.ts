import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SubscriptionsService } from '../../../../subscriptions/subscriptions.service';
import { Subscription } from '../../../../subscriptions/subscription.model';
import { AuthService } from '../../../auth/auth.service';
import { RegisterPayload } from '../../../models/auth.models';
// Sous-composant de formulaire — à rendre standalone lors de son propre portage
import { FormInscriptionComponent } from '../../pages/form-inscription/form-inscription.component';
import { EtapesInscriptionComponent } from '../../../../core/components/etapes-inscription/etapes-inscription.component';
import { CommonModule } from '@angular/common';

/**
 * Changements vs v14 :
 * - standalone: true
 * - inject() au lieu du constructeur
 * - UserService.createUser() → AuthService.register()
 * - RegisterPayload aligné sur les champs du backend (camelCase)
 * - signal() pour le chargement
 */
@Component({
    selector: 'app-inscription',
    imports: [CommonModule, FormInscriptionComponent, EtapesInscriptionComponent],
    templateUrl: './inscription.component.html'
})
export class InscriptionComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly subscriptionsService = inject(SubscriptionsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);

  public label!: MenuItem[];
  public subscriptions!: Subscription[];
  public defaultBackOption!: string;

  ngOnInit() {
    this.label = [
      { label: "Formulaire d'inscription" },
      { label: 'Ouverture du compte' },
    ];

    this.subscriptionsService.getSubscriptions().subscribe((results) => {
      this.subscriptions = results;
      const defaultSub = results.find((s) => s.isDefault);
      if (defaultSub) this.defaultBackOption = defaultSub.code;
    });
  }

  /**
   * Reçoit les données du formulaire (FormInscriptionComponent).
   * Les champs sont déjà en camelCase grâce au portage de form-inscription.
   */
  validateFormToBack(formValue: RegisterPayload) {
    this.loading.set(true);

    this.authService.register(formValue).subscribe({
      next: () => {
        // AuthService stocke les tokens et le user automatiquement
        this.router.navigate(['../succes'], { relativeTo: this.route });
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['../echec'], { relativeTo: this.route });
      },
    });
  }
}