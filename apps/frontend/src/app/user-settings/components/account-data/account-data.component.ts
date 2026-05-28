import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-account-data',
  standalone: true,
  imports: [ButtonModule, RippleModule, DialogModule],
  templateUrl: './account-data.component.html',
})
export class AccountDataComponent {
  private readonly authService = inject(AuthService);

  @Output() deletionEvent = new EventEmitter<void>();
  isVisible = false;

  deleteAccount() {
    this.deletionEvent.emit();
    this.isVisible = false;
  }

  exportData() {
    this.authService.exportMe().subscribe();
  }
}