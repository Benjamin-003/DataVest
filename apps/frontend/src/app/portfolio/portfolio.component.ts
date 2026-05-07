import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from './portfolio.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { PriceChartComponent } from '../price-chart/price-chart.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, InputNumberModule,
    TableModule, ToastModule, CardModule, PriceChartComponent,
  ],
  providers: [MessageService],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly messageService   = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly positions       = this.portfolioService.positions;
  readonly totalCost       = this.portfolioService.totalCost;
  readonly totalValue      = this.portfolioService.totalValue;
  readonly totalPnl        = this.portfolioService.totalPnl;
  readonly totalPnlPercent = this.portfolioService.totalPnlPercent;
  readonly loading         = signal(false);
readonly selectedSymbol = signal<string | null>(null);
readonly selectedName   = signal<string | null>(null);
  readonly form = this.fb.group({
    symbol:   ['', [Validators.required, Validators.maxLength(20)]],
    name:     ['', [Validators.required, Validators.maxLength(100)]],
    quantity: [null as number | null, [Validators.required, Validators.min(0.0001)]],
    buyPrice: [null as number | null, [Validators.required, Validators.min(0.0001)]],
  });

  ngOnInit() {
    this.portfolioService.load().subscribe();
  }

  add() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const { symbol, name, quantity, buyPrice } = this.form.value;

    this.portfolioService.add({
      symbol:   symbol!,
      name:     name!,
      quantity: quantity!,
      buyPrice: buyPrice!,
    }).subscribe({
      next: () => {
        this.form.reset();
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          detail: `${symbol} ajouté au portfolio`,
        });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          detail: 'Erreur lors de l\'ajout',
        });
      },
    });
  }

  remove(id: string, symbol: string) {
    this.portfolioService.remove(id).subscribe({
      next: () => this.messageService.add({
        severity: 'info',
        detail: `${symbol} retiré du portfolio`,
      }),
    });
  }

  selectPosition(symbol: string, name: string) {
  if (this.selectedSymbol() === symbol) {
    // Deuxième clic sur le même actif → ferme le graphique
    this.selectedSymbol.set(null);
    this.selectedName.set(null);
  } else {
    this.selectedSymbol.set(symbol);
    this.selectedName.set(name);
  }
}

  isPnlPositive(pnl: number | null): boolean {
    return pnl !== null && pnl >= 0;
  }
}