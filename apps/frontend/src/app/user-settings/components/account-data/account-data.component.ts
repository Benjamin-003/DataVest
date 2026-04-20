import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-account-data',
    templateUrl: './account-data.component.html',
    standalone: false
})
export class AccountDataComponent {
  @Output() deletionEvent = new EventEmitter();
  isVisible = false;

  deleteAccount() {
    this.deletionEvent.emit();
    this.isVisible = false;
  }
}

