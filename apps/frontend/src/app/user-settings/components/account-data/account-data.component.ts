import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-account-data',
  templateUrl: './account-data.component.html'
})
export class AccountDataComponent {
  @Output() deletionEvent = new EventEmitter();
  isVisible: boolean = false;

  constructor() {}

  deleteAccount() {
    this.deletionEvent.emit();
    this.isVisible = false;
  }
}

