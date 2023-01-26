import { LoggedUser } from '../../authentification/Interfaces/logged-user.model';
import { Token } from '../../authentification/Interfaces/token.model';
import { User } from '../interfaces/user.model';
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

  public currentLoggedUser = new BehaviorSubject<LoggedUser>({ id: 0, firstname: '' });

  //Envoi d'un nouveau user vers le back
  createUser(newUser: User) {
    return this.http.post<User>(userEndpoint, newUser);
  }

  //Obtenir les informations personnelles d'un utilisateur
  getUser(idUser: number) {
    return this.http.get(`${userEndpoint}/${idUser}`);
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

  //Appel le back pour générer un mail avec un nouveau mot de passe
  resetPassword(mail:string){
    return this.http.post(`${mailEndpoint}/${mail}/password`,mail)
  }
}

