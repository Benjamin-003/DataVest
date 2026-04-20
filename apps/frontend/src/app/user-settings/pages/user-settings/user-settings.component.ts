import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { LanguagesService } from '../../../languages/languages.service';
import { CurrenciesService } from '../../../currencies/currencies.service';
import { Language } from '../../../languages/interfaces/language.model';
import { Currency } from '../../../currencies/currency-model';
import { UpdateProfilePayload, ChangePasswordPayload } from '../../../core/models/auth.models';
import { PersonalDataComponent } from '../../components/personal-data/personal-data.component';
import { CredentialsComponent } from '../../components/credentials/credentials.component';
import { OtherSettingsComponent } from '../../components/other-settings/other-settings.component';

/**
 * Changements vs v14 :
 * - standalone: true
 * - UserService entièrement remplacé par AuthService
 * - PersonalData (snake_case) → User (camelCase) depuis auth.models.ts
 * - Plus de BehaviorSubject / Subscription manuelle → Signal user()
 * - updateUser() → authService.updateMe() (PATCH /api/auth/me)
 * - updatePassword() → authService.changePassword() (PATCH /api/auth/password)
 *   Payload : { old_password, new_password } → { currentPassword, newPassword }
 * - removeUpUserAccount() → authService.deleteMe() (DELETE /api/auth/me)
 *   Plus besoin de getSignInUserId() — le backend identifie via le JWT
 * - deleteUserToken() → authService.logout() géré proprement dans deleteMe()
 */
@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ToastModule, PersonalDataComponent, CredentialsComponent, OtherSettingsComponent],
  providers: [MessageService],
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguagesService);
  private readonly currenciesService = inject(CurrenciesService);
  private readonly messageService = inject(MessageService);

  // Profil courant depuis le Signal (pas de subscription à gérer)
  readonly user = this.authService.user;

  // Données de référence
  readonly languages = signal<Language[]>([]);
  readonly currencies = signal<Currency[]>([]);

  // Mémorise la langue au chargement pour détecter un changement (reload i18n)
  private oldLanguageSetting = '';

  private readonly messages = {
    emailUpdated:    'Votre nouvelle adresse mail est bien prise en compte',
    profileUpdated:  'Vos modifications ont bien été prises en compte',
    profileError:    "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard",
    passwordUpdated: 'Votre nouveau mot de passe a bien été enregistré',
    passwordError:   "Votre nouveau mot de passe n'a pas pu être sauvegardé. Veuillez réessayer plus tard",
    deleteError:     "Une erreur est survenue et votre compte n'a pas pu être supprimé. Veuillez réessayer.",
    deleteSuccess:   'Votre compte a bien été supprimé. Vous allez être redirigé dans quelques secondes.',
  };

  ngOnInit() {
    // Mémorise la langue initiale pour détecter un changement ultérieur
    this.oldLanguageSetting = this.user()?.languageCode ?? '';

    this.languageService.getLanguages().subscribe((data) => this.languages.set(data));
    this.currenciesService.getCurrencies().subscribe((data) => this.currencies.set(data));
  }

  /**
   * Mise à jour du profil (données personnelles ou préférences).
   * indexMessage permet au template de choisir le message de succès approprié.
   */
  updateProfile(payload: UpdateProfilePayload, successMessage: string) {
    this.authService.updateMe(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: successMessage });
        // Si la langue a changé, on recharge pour appliquer les nouvelles traductions
        if (payload.languageCode && payload.languageCode !== this.oldLanguageSetting) {
          location.reload();
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', detail: this.messages.profileError });
      },
    });
  }

  onPersonalDataUpdate(payload: UpdateProfilePayload) {
    this.updateProfile(payload, this.messages.profileUpdated);
  }

  onEmailUpdate(payload: UpdateProfilePayload) {
    this.updateProfile(payload, this.messages.emailUpdated);
  }

  onOtherSettingsUpdate(payload: UpdateProfilePayload) {
    this.updateProfile(payload, this.messages.profileUpdated);
  }

  onPasswordUpdate(payload: ChangePasswordPayload) {
    this.authService.changePassword(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: this.messages.passwordUpdated });
      },
      error: () => {
        this.messageService.add({ severity: 'error', detail: this.messages.passwordError });
      },
    });
  }

  deleteAccount() {
    this.authService.deleteMe().subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: this.messages.deleteSuccess });
        // AuthService.deleteMe() appelle clearSession() automatiquement
        setTimeout(() => location.href = '/accueil', 3000);
      },
      error: () => {
        this.messageService.add({ severity: 'error', detail: this.messages.deleteError });
      },
    });
  }
}