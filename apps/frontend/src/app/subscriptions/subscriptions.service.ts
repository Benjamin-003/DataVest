import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from './subscription.model';
import { Observable } from 'rxjs';

const subscriptionsEndpoint = `${environment.apiUrl}/subscriptions`;

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  constructor(private readonly http: HttpClient) {}

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(subscriptionsEndpoint);
  }
}