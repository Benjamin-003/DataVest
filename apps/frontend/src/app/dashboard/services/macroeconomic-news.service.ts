import { environment } from './../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import * as XMLtoJSON from 'xml-js'
const FTEndpoint = `${environment.apiUrl}/articles/`;
const parsedResult = (articleResult: string) => {
                                                  return XMLtoJSON.xml2json(articleResult, { compact: true, spaces: 1 })
                                                };
@Injectable({
  providedIn: 'root'
})
export class MacroeconomicNewsService {
  private readonly http = inject(HttpClient);

  //Appel le flux RSS d'un journal
  getNews(URLStream: string) {
const encodedURL = btoa(URLStream);
    return this.http.get(`${FTEndpoint}${encodedURL}`, { responseType: 'text' }).pipe(
      map(articleResult => {
        return JSON.parse(parsedResult(articleResult))
      }))
  }
}
