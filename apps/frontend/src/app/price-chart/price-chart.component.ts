import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceChartService } from './price-chart.service';
import { PricePoint, Range, RANGE_LABELS } from './price-chart.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './price-chart.component.html',
})
export class PriceChartComponent implements OnChanges {
  private readonly priceChartService = inject(PriceChartService);

  @Input() symbol!: string;
  @Input() name!: string;

  readonly data      = signal<PricePoint[]>([]);
  readonly loading   = signal(false);
  readonly error     = signal(false);
  readonly range     = signal<Range>('1mo');
  readonly rangeLabels = RANGE_LABELS;
  readonly ranges: Range[] = ['1d', '5d', '1mo', '1y'];

  // Prix de début et fin pour colorer le graphique
  readonly firstPrice = signal<number | null>(null);
  readonly lastPrice  = signal<number | null>(null);
  readonly isPositive = signal(true);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol']?.currentValue) {
      this.load();
    }
  }

  load() {
    if (!this.symbol) return;
    this.loading.set(true);
    this.error.set(false);

    this.priceChartService.getHistory(this.symbol, this.range()).subscribe({
      next: (points) => {
        this.data.set(points);
        if (points.length > 0) {
          const first = points[0].price;
          const last  = points[points.length - 1].price;
          this.firstPrice.set(first);
          this.lastPrice.set(last);
          this.isPositive.set(last >= first);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  changeRange(range: Range) {
    this.range.set(range);
    this.load();
  }

  // Génère le path SVG du graphique à partir des données
  generatePath(points: PricePoint[], width: number, height: number): string {
    if (points.length < 2) return '';

    const prices    = points.map(p => p.price);
    const minPrice  = Math.min(...prices);
    const maxPrice  = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const xStep = width / (points.length - 1);
    const padding = 10;
    const chartHeight = height - padding * 2;

    return points.map((point, i) => {
      const x = i * xStep;
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  formatDate(timestamp: number, range: Range): string {
    const date = new Date(timestamp);
    if (range === '1d') {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}