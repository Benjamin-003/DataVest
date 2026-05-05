import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WatchlistService } from './watchlist.service';
import { AssetType } from './watchlist.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule,
            InputTextModule, SelectModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: 'watchlist.component.html',
})
export class WatchlistComponent implements OnInit {
  private readonly watchlistService = inject(WatchlistService);
  private readonly messageService   = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly items   = this.watchlistService.items;
  readonly loading = signal(false);

  readonly assetTypes = [
    { label: 'Action',          value: 'STOCK'     },
    { label: 'Cryptomonnaie',   value: 'CRYPTO'    },
    { label: 'Matière première', value: 'COMMODITY' },
    { label: 'Indice',          value: 'INDEX'     },
    { label: 'Devise',          value: 'FOREX'     },
  ];

  readonly form = this.fb.group({
    symbol: ['', [Validators.required, Validators.maxLength(20)]],
    name:   ['', [Validators.required, Validators.maxLength(100)]],
    type:   [null as AssetType | null, Validators.required],
  });

  ngOnInit() {
    this.watchlistService.load().subscribe();
  }

  add() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { symbol, name, type } = this.form.value;
    this.watchlistService.add({ symbol: symbol!, name: name!, type: type! }).subscribe({
      next: () => {
        this.form.reset();
        this.loading.set(false);
        this.messageService.add({ severity: 'success', detail: `${symbol} ajouté à votre watchlist` });
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', detail: err.error?.message ?? 'Erreur' });
      },
    });
  }

  remove(id: string, symbol: string) {
    this.watchlistService.remove(id).subscribe({
      next: () => this.messageService.add({ severity: 'info', detail: `${symbol} retiré` }),
    });
  }

  getTypeLabel(type: string): string {
  return this.assetTypes.find(t => t.value === type)?.label ?? type;
}
}