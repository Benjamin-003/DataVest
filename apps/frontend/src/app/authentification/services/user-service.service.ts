import { Token } from './../Interfaces/token.model';
import { User } from '../Interfaces/user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';

const userEndpoint = `${environment.urlApi}/users`;
const mailEndpoint = `${environment.urlApi}/mails`;
const loginEndpoint = `${environment.urlApi}/tokens`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  public currentLoggedUserName= new BehaviorSubject<string>('');
  //Envoi d'un nouveau user vers le back
  createUser(newUser: User) {
    return this.http.post<User>(userEndpoint, newUser);
  }

  //Obtenir le prenom d'un utilisateur
  getUserName(idUser: number) {
    return this.http.get(`${userEndpoint}/${idUser}`).pipe(map((rawData: any) => {
      return rawData['firstname'];
    })
    );
  }

  //Verification des doublons d'email
  isMailTaken(mail: string) {
    return this.http.head(`${mailEndpoint}/${mail}`, { observe: 'response' }).pipe(map(response => {
      return response.status
    }))
  }

  //Appel le back pour la connexion
  signInUser(credential: Credential): Observable<Token> {
    return this.http.post<Token>(loginEndpoint, credential);
  }
}

