import { inject, Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { loadTranslations } from '@angular/localize';
import { firstValueFrom, map } from 'rxjs';

// Imports statiques — compatibles esbuild/Vite (pas de webpackInclude)
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

// Fichiers de traductions importés statiquement
import * as frTranslations from '../../assets/i18n/fr.json';
import * as enTranslations from '../../assets/i18n/en.json';

import { LanguagesService } from '../languages/languages.service';

/**
 * Service i18n réécrit pour Angular 17+ avec esbuild.
 *
 * Problème v14 :
 *   Les deux dynamic imports utilisaient /* webpackInclude * / et des chemins
 *   node_modules/ qui ne fonctionnent qu'avec webpack — esbuild les ignore.
 *
 * Solution Angular 19 :
 *   - Imports statiques des locales Angular (@angular/common/locales/fr|en)
 *   - Imports statiques des fichiers JSON de traductions
 *   - Switch sur la locale pour enregistrer les bonnes données
 *   - loadTranslations() toujours appelé avant le bootstrap (via APP_INITIALIZER)
 *
 * Pour ajouter une langue :
 *   1. Ajouter le fichier src/assets/i18n/xx.json
 *   2. Importer localeXx from '@angular/common/locales/xx'
 *   3. Importer * as xxTranslations from '../../assets/i18n/xx.json'
 *   4. Ajouter le cas dans le switch de applyLocale()
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly languagesService = inject(LanguagesService);

  private browserLocale = navigator.language;

  locale: string = this.browserLocale.includes('-')
    ? this.browserLocale.substring(0, this.browserLocale.indexOf('-'))
    : this.browserLocale;

  /**
   * Point d'entrée appelé par APP_INITIALIZER dans app.config.ts.
   * 1. Récupère les codes de langue disponibles depuis le backend
   * 2. Applique la préférence sauvegardée en session (si existante)
   * 3. Enregistre la locale Angular et charge les traductions
   */
  async init(): Promise<void> {
    try {
      // Récupère les langues disponibles depuis le backend
      const availableLanguages = await firstValueFrom(
        this.languagesService.getLanguages().pipe(
          map((langs) => langs.map((l) => l.code.toLowerCase()))
        )
      );

      // Applique la langue sauvegardée en session (définie dans AuthService.getUser())
      const savedLocale = sessionStorage.getItem('Language');
      if (savedLocale) {
        this.locale = savedLocale.toLowerCase();
      }

      // Repli sur 'fr' si la locale n'est pas disponible
      if (!availableLanguages.includes(this.locale)) {
        this.locale = 'fr';
      }
    } catch {
      // Si le backend est inaccessible au démarrage, on replie sur 'fr'
      this.locale = 'fr';
    }

    this.applyLocale(this.locale);
  }

  /**
   * Enregistre les données de locale Angular et charge les traductions.
   * Switch statique → esbuild peut tree-shaker les locales non utilisées.
   */
  private applyLocale(locale: string): void {
    switch (locale) {
      case 'en':
        registerLocaleData(localeEn);
        loadTranslations(enTranslations as Record<string, string>);
        break;

      case 'fr':
      default:
        registerLocaleData(localeFr);
        loadTranslations(frTranslations as Record<string, string>);
        break;
    }
  }
}