import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PricePoint, Range } from './price-chart.model';

const BASE = `${environment.apiUrl}/prices`;

@Injectable({ providedIn: 'root' })
export class PriceChartService {
  private readonly http = inject(HttpClient);

  getHistory(symbol: string, range: Range) {
    return this.http.get<PricePoint[]>(`${BASE}/${symbol}?range=${range}`);
  }
}