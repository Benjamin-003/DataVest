import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const userEndpoint = `${environment.urlApi}/users/`;
@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  constructor(private http: HttpClient) { }

  getPersonalDataUser(id: number) {
    return this.http.get(`${userEndpoint}${id}`)
  }
}
