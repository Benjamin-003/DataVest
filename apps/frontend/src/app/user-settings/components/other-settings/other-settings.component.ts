import { Currency } from './../../../currencies/currency-model';
import { Language } from '../../../languages/interfaces/language.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html'
})

export class OtherSettingsComponent implements OnChanges {
  @Input() languages!: Language[];
  @Input() userLanguage!: string;
  @Input() currencies!: Currency[];
  @Input() userCurrency!: string;
  otherSettingsForm!: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userLanguage"] || changes["userCurrency"]) {
      this.initOtherSettingsForm(changes["userLanguage"].currentValue, changes["userCurrency"].currentValue);
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
      },
    );
  }
}

