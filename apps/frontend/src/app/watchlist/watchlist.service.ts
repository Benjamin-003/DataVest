import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { WatchlistItem, AddWatchlistItemPayload } from './watchlist.model';

const BASE = `${environment.apiUrl}/watchlist`;

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly http = inject(HttpClient);

  // Signal central — toute l'UI se met à jour automatiquement
  readonly items = signal<WatchlistItem[]>([]);

  load() {
    return this.http.get<WatchlistItem[]>(BASE).pipe(
      tap(items => this.items.set(items))
    );
  }

  add(payload: AddWatchlistItemPayload) {
    return this.http.post<WatchlistItem>(BASE, payload).pipe(
      // Ajoute en tête de liste sans recharger
      tap(item => this.items.update(list => [item, ...list]))
    );
  }

  remove(id: string) {
    return this.http.delete<void>(`${BASE}/${id}`).pipe(
      // Retire de la liste locale immédiatement
      tap(() => this.items.update(list => list.filter(i => i.id !== id)))
    );
  }
}