import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
const FTEndpoint = `${environment.urlApi}/requests/`;
@Injectable({
  providedIn: 'root'
})
export class MacroeconomicNewsService {

  constructor(private http: HttpClient) { }
  //Appel le flux RSS du Financial Times
  getFinancialTimesNews() {
    const encodedURL = encodeURIComponent("https://www.ft.com/rss/home")
    return this.http.get(`${FTEndpoint}${encodedURL}`, { responseType: 'text' }).pipe(
      map(articleResult => {
        const convert = require('xml-js');
        const parsedResult = convert.xml2json(articleResult, { compact: true, spaces: 1 });
        return JSON.parse(parsedResult)
      }))
  }
}
