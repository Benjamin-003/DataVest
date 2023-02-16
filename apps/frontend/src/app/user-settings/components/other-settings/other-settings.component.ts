import { Language } from '../../../languages/interfaces/language.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html'
})

export class OtherSettingsComponent implements OnChanges {
  @Input() languages!: Language[]
  @Input() userLanguage!: string
  languageForm!: FormGroup

  constructor(private readonly formBuilder: FormBuilder) { }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userLanguage"]) {
      this.initLanguageForm(changes["userLanguage"].currentValue);
    }
  }

  initLanguageForm(codeLanguage: string) {
    this.languageForm = this.formBuilder.group(
      {
        language_code: [
          codeLanguage, [Validators.required]
        ]
      }
    );
  }
}

