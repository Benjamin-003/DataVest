import { Component, inject, OnInit, signal } from '@angular/core';
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
import { AccountDataComponent } from '../../components/account-data/account-data.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    PersonalDataComponent,
  CredentialsComponent,
  OtherSettingsComponent,
  AccountDataComponent,
],
  providers: [MessageService],
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguagesService);
  private readonly currenciesService = inject(CurrenciesService);
  private readonly messageService = inject(MessageService);

  readonly user = this.authService.user;
  readonly languages = signal<Language[]>([]);
  readonly currencies = signal<Currency[]>([]);

  private oldLanguageSetting = '';

  private readonly messages = {
    emailUpdated:   'Votre nouvelle adresse mail est bien prise en compte',
    profileUpdated: 'Vos modifications ont bien été prises en compte',
    profileError:   "Nous n'avons pas pu enregistrer vos modifications. Veuillez réessayer plus tard",
    passwordUpdated:'Votre nouveau mot de passe a bien été enregistré',
    passwordError:  "Votre nouveau mot de passe n'a pas pu être sauvegardé. Veuillez réessayer plus tard",
    deleteError:    "Une erreur est survenue et votre compte n'a pas pu être supprimé. Veuillez réessayer.",
    deleteSuccess:  'Votre compte a bien été supprimé. Vous allez être redirigé dans quelques secondes.',
  };

  ngOnInit() {
    this.oldLanguageSetting = this.user()?.languageCode ?? '';
    this.languageService.getLanguages().subscribe((data) => this.languages.set(data));
    this.currenciesService.getCurrencies().subscribe((data) => this.currencies.set(data));
  }

  updateProfile(payload: UpdateProfilePayload, successMessage: string) {
    this.authService.updateMe(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: successMessage });
        if (payload.languageCode && payload.languageCode !== this.oldLanguageSetting) {
          location.reload();
        }
      },
      error: () => this.messageService.add({ severity: 'error', detail: this.messages.profileError }),
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
      next: () => this.messageService.add({ severity: 'success', detail: this.messages.passwordUpdated }),
      error: () => this.messageService.add({ severity: 'error', detail: this.messages.passwordError }),
    });
  }

  deleteAccount() {
    this.authService.deleteMe().subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: this.messages.deleteSuccess });
        setTimeout(() => location.href = '/accueil', 3000);
      },
      error: () => this.messageService.add({ severity: 'error', detail: this.messages.deleteError }),
    });
  }
}