import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, Injectable, LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';

@Injectable({
  providedIn: 'root',
})

class I18n {
  browserLocale = navigator.language;
  locale: string = this.browserLocale.includes('-')
    ? this.browserLocale.substring(0, this.browserLocale.indexOf('-'))
    : this.browserLocale;
  userLocale: string | null = null;
  async setLocale() {
    this.userLocale = sessionStorage.getItem('Language');

    if (this.userLocale) {
      this.locale = this.userLocale.toLowerCase();
    }

    if (this.locale !== 'fr' && this.locale !== 'en') {
      this.locale = 'fr'
    }

    const localeModule = await import(
      /* webpackInclude: /(en|fr)\.mjs$/ */
      `/node_modules/@angular/common/locales/${this.locale}.mjs`
    );

    // Définir les paramètres régionaux pour les pipes
    registerLocaleData(localeModule.default);

    // Chargement des fichiers de localisation
    const localeTranslationsModule = await import(
      `src/assets/i18n/${this.locale}.json`
    );

    //Charger les traductions pour les paramètres régionaux actuels à la volée
    loadTranslations(localeTranslationsModule.default);
  }

}

//Chargement des données locales au démarrage de l'application
function setLocale() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18n) => () => i18n.setLocale(),
    deps: [I18n],
    multi: true,
  };
}

//Définition des paramètres régionaux d'exécution de l'application
function setLocaleId() {
  return {
    provide: LOCALE_ID,
    useFactory: (i18n: I18n) => i18n.locale,
    deps: [I18n],
  };
}

export const I18nModule = {
  setLocale: setLocale,
  setLocaleId: setLocaleId,
};
