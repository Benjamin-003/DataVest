import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Language } from '../../../languages/interfaces/language.model';
import { Currency } from '../../../currencies/currency-model';
import { UpdateProfilePayload } from '../../../core/models/auth.models';

@Component({
  selector: 'app-other-settings',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, ButtonModule],
  templateUrl: './other-settings.component.html',
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