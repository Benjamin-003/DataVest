import { Language } from './interfaces/language.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const languageEndpoint = `${environment.urlApi}/languages`

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  constructor(private readonly http: HttpClient) { }

  //Métghode d'appel de back pour récupérer la liste des données
  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${languageEndpoint}`)
  }
}
