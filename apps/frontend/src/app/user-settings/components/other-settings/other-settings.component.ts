import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Language } from '../../../languages/interfaces/language.model';
import { Currency } from '../../../currencies/currency-model';
import { UpdateProfilePayload } from '../../../core/models/auth.models';

/**
 * Changements vs v14 :
 * - standalone: true, inject()
 * - Champs renommés :
 *     language_code → languageCode
 *     currency_code → currencyCode
 * - @Output() émet UpdateProfilePayload { languageCode, currencyCode }
 *   au lieu de PersonalData (snake_case)
 * - noChangeValidator adapté aux nouveaux noms
 *
 * Note PrimeNG 19 : p-dropdown → p-select (renommage dans PrimeNG 19).
 *   Si migration PrimeNG 19 faite, remplacer DropdownModule par SelectModule
 *   et <p-dropdown> par <p-select> dans le template.
 */
@Component({
    selector: 'app-other-settings',
    imports: [ReactiveFormsModule, DropdownModule, ButtonModule],
    templateUrl: './other-settings.component.html'
})
export class OtherSettingsComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() languages!: Language[];
  @Input() userLanguage!: string;
  @Input() currencies!: Currency[];
  @Input() userCurrency!: string;

  @Output() modifyOtherSettings = new EventEmitter<UpdateProfilePayload>();

  form = this.fb.group({ languageCode: [''], currencyCode: [''] });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userLanguage'] || changes['userCurrency']) {
      const lang = changes['userLanguage']?.currentValue ?? this.userLanguage;
      const cur  = changes['userCurrency']?.currentValue ?? this.userCurrency;
      this.initForm(lang, cur);
    }
  }

  initForm(languageCode: string, currencyCode: string) {
    this.form = this.fb.group(
      {
        languageCode: [languageCode, Validators.required],
        currencyCode: [currencyCode, Validators.required],
      },
      { validators: [this.noChangeValidator(languageCode, currencyCode)] }
    );
  }

  private noChangeValidator(origLang: string, origCur: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const unchanged =
        control.get('languageCode')?.value === origLang &&
        control.get('currencyCode')?.value === origCur;
      return unchanged ? { noChangeValues: true } : null;
    };
  }

  saveModification() {
    if (this.form.invalid) return;
    this.modifyOtherSettings.emit(this.form.value as UpdateProfilePayload);
  }
}