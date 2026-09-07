import { inject, Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { loadTranslations } from '@angular/localize';
import { firstValueFrom, map } from 'rxjs';

import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

import frTranslationsRaw from '../../assets/i18n/fr.json';
import enTranslationsRaw from '../../assets/i18n/en.json';

import { LanguagesService } from '../languages/languages.service';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languagesService = inject(LanguagesService);

  private browserLocale = navigator.language;

  locale: string = this.browserLocale.includes('-')
    ? this.browserLocale.substring(0, this.browserLocale.indexOf('-'))
    : this.browserLocale;

  async init(): Promise<void> {
    try {
      const availableLanguages = await firstValueFrom(
        this.languagesService.getLanguages().pipe(
          map((langs) => langs.map((l) => l.code.toLowerCase()))
        )
      );
      const savedLocale = sessionStorage.getItem('Language');
      if (savedLocale) this.locale = savedLocale.toLowerCase();
      if (!availableLanguages.includes(this.locale)) this.locale = 'fr';
    } catch {
      this.locale = 'fr';
    }
    this.applyLocale(this.locale);
  }

  private applyLocale(locale: string): void {
    switch (locale) {
      case 'en':
        registerLocaleData(localeEn);
        loadTranslations(enTranslationsRaw as unknown as Record<string, string>);
        break;
      case 'fr':
      default:
        registerLocaleData(localeFr);
        loadTranslations(frTranslationsRaw as unknown as Record<string, string>);
        break;
    }
  }
}