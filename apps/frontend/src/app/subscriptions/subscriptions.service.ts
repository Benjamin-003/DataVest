import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from './subscription.model';
import { Observable } from 'rxjs';

const subscriptionsEndpoint = `${environment.urlApi}/subscriptions`;

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private readonly http: HttpClient) { }

  //Méthode d'appel de back pour récupérer la liste des données
  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${subscriptionsEndpoint}`);
  }
}
