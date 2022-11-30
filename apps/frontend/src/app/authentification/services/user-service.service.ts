import { User } from '../Interfaces/user';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

const userEndpoint = `${environment.urlApi}/users`
const mailEndpoint = `${environment.urlApi}/mails`

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  //Envoi d'un nouveau user vers le back
  createUser(newUser: User) {
    return this.http.post<User>(userEndpoint, newUser)
  }

  //Verification des doublons d'email
  isMailTaken(mail: string) {
    return this.http.head(`${mailEndpoint}/${mail}`,{observe: 'response'}).pipe(map(response => {
         return response.status
    }))
  }
}

