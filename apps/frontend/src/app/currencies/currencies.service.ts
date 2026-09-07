import { Currency } from './currency-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const currencyEndpoint = `${environment.apiUrl}/currencies`;

@Injectable({ providedIn: 'root' })
export class CurrenciesService {
  constructor(private readonly http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(currencyEndpoint);
  }
}