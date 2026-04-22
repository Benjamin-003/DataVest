import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-account-data',
  standalone: true,
  imports: [ButtonModule, RippleModule, DialogModule],
  templateUrl: './account-data.component.html',
})
export class AccountDataComponent {
  @Output() deletionEvent = new EventEmitter<void>();
  isVisible = false;

  deleteAccount() {
    this.deletionEvent.emit();
    this.isVisible = false;
  }
}