import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const FTEndpoint = `${environment.urlApi}/requests/`;
@Injectable({
  providedIn: 'root'
})
export class MacroeconomicNewsService {

  constructor(private http: HttpClient) {}

  //Appel le flux RSS du Financial Times
  getFinancialTimesNews() {
    const encodedURL =  encodeURIComponent("https://www.ft.com/rss/home")
    return this.http.get(`${FTEndpoint}${encodedURL}`,{responseType:'text'})
  }
}
