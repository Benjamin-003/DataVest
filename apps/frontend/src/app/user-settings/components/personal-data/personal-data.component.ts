import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { User, UpdateProfilePayload } from '../../../core/models/auth.models';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DatePickerModule, ButtonModule],
  templateUrl: './personal-data.component.html',
})
export class PersonalDataComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  public readonly messagesErreur = "Ce champ est obligatoire, merci de saisir l'information demandée";

  @Input() user!: User;
  @Output() modificationEvent = new EventEmitter<UpdateProfilePayload>();

  form = this.fb.group({ firstName: [''], lastName: [''], birthdate: [new Date()], address: [''], zipcode: [''], city: [''], country: [''] });

  get firstName() { return this.form.get('firstName'); }
  get lastName()  { return this.form.get('lastName'); }
  get birthdate() { return this.form.get('birthdate'); }
  get address()   { return this.form.get('address'); }
  get zipcode()   { return this.form.get('zipcode'); }
  get city()      { return this.form.get('city'); }
  get country()   { return this.form.get('country'); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']?.currentValue) {
      this.initForm(changes['user'].currentValue as User);
    }
  }

  initForm(user: User) {
    const birthdateValue = user.birthdate ? new Date(user.birthdate) : new Date();
    this.form = this.fb.group(
      {
        firstName: [user.firstName ?? '', Validators.required],
        lastName:  [user.lastName  ?? '', Validators.required],
        birthdate: [birthdateValue,       Validators.required],
        address:   [user.address   ?? '', Validators.required],
        zipcode:   [user.zipcode   ?? '', Validators.required],
        city:      [user.city      ?? '', Validators.required],
        country:   [user.country   ?? '', Validators.required],
      },
      { validators: [this.noChangeValidator(user, birthdateValue)] }
    );
  }

  private noChangeValidator(original: User, originalDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sameDate = this.dateToISO(control.get('birthdate')?.value) === this.dateToISO(originalDate);
      const unchanged =
        control.get('firstName')?.value === (original.firstName ?? '') &&
        control.get('lastName')?.value  === (original.lastName  ?? '') &&
        sameDate &&
        control.get('address')?.value   === (original.address   ?? '') &&
        control.get('zipcode')?.value   === (original.zipcode   ?? '') &&
        control.get('city')?.value      === (original.city      ?? '') &&
        control.get('country')?.value   === (original.country   ?? '');
      return unchanged ? { noChangeValues: true } : null;
    };
  }

  private dateToISO(date: Date): string {
    if (!date || !(date instanceof Date)) return '';
    const day   = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  saveModification() {
    if (this.form.invalid) return;
    const { birthdate, ...rest } = this.form.value;
    const payload: UpdateProfilePayload = {
      firstName: rest.firstName ?? undefined,
      lastName:  rest.lastName  ?? undefined,
      address:   rest.address   ?? undefined,
      zipcode:   rest.zipcode   ?? undefined,
      city:      rest.city      ?? undefined,
      country:   rest.country   ?? undefined,
      birthdate: this.dateToISO(birthdate as Date),
    };
    this.modificationEvent.emit(payload);
  }
}