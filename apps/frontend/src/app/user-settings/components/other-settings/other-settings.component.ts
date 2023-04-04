import { PersonalData } from './../../../users/interfaces/personal-data.model';
import { Currency } from './../../../currencies/currency-model';
import { Language } from '../../../languages/interfaces/language.model';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html'
})

export class OtherSettingsComponent implements OnChanges {
  @Input() languages!: Language[];
  @Input() userLanguage!: string;
  @Input() currencies!: Currency[];
  @Input() userCurrency!: string;
  @Output("modifyOtherSettings") modificationEvent = new EventEmitter();
  otherSettingsForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userLanguage"] || changes["userCurrency"]) {
      const userLanguage = changes["userLanguage"] ? changes["userLanguage"].currentValue : this.userLanguage;
      const userCurrency = changes["userCurrency"] ? changes["userCurrency"].currentValue : this.userCurrency;
      this.initOtherSettingsForm(userLanguage, userCurrency);
    }
  }

  initOtherSettingsForm(codeLanguage: string, codeCurrency: string) {
    this.otherSettingsForm = this.formBuilder.group(
      {
        language_code: [
          codeLanguage, [Validators.required]
        ]
        ,
        currency_code: [
          codeCurrency, [Validators.required]
        ]
      }, { validators: [this.noChangeValuesValidator(this.userLanguage, this.userCurrency)] }
    );
  }

  noChangeValuesValidator(userLanguage: string, userCurrency: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const codeLanguage = control.get('language_code');
      const codeCurrency = control.get('currency_code');
      return codeLanguage?.value === userLanguage
        && codeCurrency?.value === userCurrency
        ? { noChangeValues: true } : null;
    };
  }

  //On emet les données au composant parent
  saveModification() {
    if (this.otherSettingsForm.valid) {
      this.modificationEvent.emit(this.otherSettingsForm.value as PersonalData)
    }
  }
}


