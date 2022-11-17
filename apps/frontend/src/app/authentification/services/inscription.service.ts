import { User } from './../Interfaces/user';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const userEndpoint = `${environment.urlApi}/users`

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  
  constructor(private readonly http: HttpClient) { }

  //Envoi d'un nouveau user vers le back
  createUser(newUser: User) {
    return this.http.post<User>(userEndpoint, newUser)
  }
}
