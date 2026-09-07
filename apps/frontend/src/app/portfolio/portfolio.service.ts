import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Position, AddPositionPayload } from './portfolio.model';

const BASE = `${environment.apiUrl}/portfolio`;

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);

  readonly positions = signal<Position[]>([]);

  // Total investi
  readonly totalCost = signal<number>(0);

  // Valeur actuelle totale
  readonly totalValue = signal<number>(0);

  // P&L global
  readonly totalPnl = signal<number>(0);
  readonly totalPnlPercent = signal<number>(0);

  load() {
    return this.http.get<Position[]>(BASE).pipe(
      tap(positions => {
        this.positions.set(positions);
        this.computeTotals(positions);
      })
    );
  }

  add(payload: AddPositionPayload) {
    return this.http.post<Position>(BASE, payload).pipe(
      tap(() => this.load().subscribe()) // recharge pour avoir les prix à jour
    );
  }

  remove(id: string) {
    return this.http.delete<void>(`${BASE}/${id}`).pipe(
      tap(() => {
        const updated = this.positions().filter(p => p.id !== id);
        this.positions.set(updated);
        this.computeTotals(updated);
      })
    );
  }

  private computeTotals(positions: Position[]) {
    const cost  = positions.reduce((sum, p) => sum + p.cost, 0);
    const value = positions.reduce((sum, p) => sum + (p.value ?? p.cost), 0);
    const pnl   = value - cost;

    this.totalCost.set(cost);
    this.totalValue.set(value);
    this.totalPnl.set(pnl);
    this.totalPnlPercent.set(cost > 0 ? (pnl / cost) * 100 : 0);
  }
}