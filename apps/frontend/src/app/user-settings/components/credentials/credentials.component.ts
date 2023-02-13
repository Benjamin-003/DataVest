import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UniqueMailValidator } from 'src/app/authentification/services/unique-mail-validator';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html'
})
export class CredentialsComponent implements OnInit, OnChanges {
  public emailForm!: FormGroup;
  @Input() userMail!: string;
  @Output() modificationEvent = new EventEmitter();

  constructor(private readonly formBuilder: FormBuilder, private readonly uniqueMail: UniqueMailValidator) { }
  get mail() { return this.emailForm.get('mail'); }

  ngOnInit() {
    this.uniqueMail.currentMail = this.userMail;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges["userMail"]) {
      this.initForm(simpleChanges["userMail"].currentValue)
    }
  }

  initForm(email: string) {
    this.emailForm = this.formBuilder.group({
      mail: [
        email,
        {
          validators: [
            Validators.required,
            Validators.email
          ],
          asyncValidators: [
            this.uniqueMail.validate.bind(this.uniqueMail)
          ] as AsyncValidatorFn[],
          updateOn: 'change',
        }
      ]
    }, { validators: this.noChangeValuesValidator() }
    )
  }

  noChangeValuesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('mail')?.value === this.userMail
        ? { noChangeValues: true } : null;
    };
  }

  saveModification() {
    this.modificationEvent.emit(this.emailForm.value)
  }
}
