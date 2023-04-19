import jwtDecode from 'jwt-decode';
import { Password } from './../interfaces/password.model';
import { PersonalData } from './../interfaces/personal-data.model';
import { LoggedUser } from '../../authentification/Interfaces/logged-user.model';
import { Token } from '../../authentification/Interfaces/token.model';
import { User } from '../interfaces/user.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';

const userEndpoint = `${environment.urlApi}/users`;
const mailEndpoint = `${environment.urlApi}/mails`;
const loginEndpoint = `${environment.urlApi}/tokens`;
const USER_KEY = 'authentification-user';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  public currentLoggedUser = new BehaviorSubject<LoggedUser>({
    id: 0,
    firstname: '',
  });
  private readonly _currentPersonalData$ = new BehaviorSubject<PersonalData>({
    surname: '',
    firstname: '',
    birth_date: '',
    address: '',
    zip_code: '',
    city: '',
    country: '',
    mail: '',
    language_code: '',
    currency_code: '',
    subscription_code: ''
  });

  get token() {
    return sessionStorage.getItem(USER_KEY);
  }

  get currentPersonalData$() {
    if (
      this._currentPersonalData$.value.firstname === '' &&
      this.token !== null
    ) {
      try {
        const tokenPayload: { id: string } = jwtDecode(this.token);
        this.getUser(+tokenPayload.id).subscribe();
      } catch (error) { }
    }
    return this._currentPersonalData$.asObservable();
  }

  //Envoi d'un nouveau user vers le back
  createUser(newUser: User) {
    return this.http.post<User>(userEndpoint, newUser);
  }

  //Envoi d'un nouveau user vers le back
  updateUser(userToUpdate: PersonalData) {
    return this.http
      .patch(`${userEndpoint}/${this.currentLoggedUser.value.id}`, userToUpdate)
      .pipe(
        map(() => {
          this.getUser(this.currentLoggedUser.value.id).subscribe();
        })
      );
  }

  //Obtenir les informations personnelles d'un utilisateur
  getUser(idUser: number): Observable<PersonalData> {
    return this.http.get<PersonalData>(`${userEndpoint}/${idUser}`).pipe(
      map((personalData) => {
        this._currentPersonalData$.next(personalData);
        sessionStorage.setItem('Language',personalData.language_code.toLowerCase())
        this.currentLoggedUser.next({
          id: idUser,
          firstname: personalData.firstname,
        });
        return personalData;
      })
    );
  }

  //Verification des doublons d'email
  isMailTaken(mail: string) {
    return this.http
      .head(`${mailEndpoint}/${mail}`, { observe: 'response' })
      .pipe(
        map((response) => {
          return response.status;
        })
      );
  }

  //Appel le back pour la connexion
  signInUser(credential: Credential): Observable<Token> {
    return this.http.post<Token>(loginEndpoint, credential).pipe(
      map((response) => {
        this.saveUserToken(response.token);
        return response;
      })
    );
  }

  saveUserToken(token: string): void {
    try {
      const tokenPayload: { id: string } = jwtDecode(token);
      sessionStorage.setItem(USER_KEY, token);
      this.getUser(+tokenPayload.id).subscribe();
    } catch (error) {
      return;
    }
  }

  getSignInUserId(): {id: string} | null {
    const token: string | null = sessionStorage.getItem(USER_KEY);
    if(token){
      return jwtDecode(token);
    }
    return null;
  }

  deleteUserToken() {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('Language');
    this._currentPersonalData$.next({
      surname: '',
      firstname: '',
      birth_date: '',
      address: '',
      zip_code: '',
      city: '',
      country: '',
      mail: '',
      language_code: '',
      currency_code: '',
      subscription_code: ''
    });
  }

  //Méthode qui permet de supprimer définitevement le compte utilisateur définitevement
  removeUpUserAccount(id: string){
  return this.http.delete(`${userEndpoint}/${id}`)
}

  //Appel le back pour générer un mail avec un nouveau mot de passe
  resetPassword(mail: string) {
    return this.http.post(`${mailEndpoint}/${mail}/password`, mail);
  }

  //Récupère l'ID a partir du token temporaire
  getIDIntoRefreshToken(token: string | null) {
    if (token) {
      try {
        const tokenPayload: { id: string } = jwtDecode(token);
        return tokenPayload;
      } catch (error) {
        return undefined;
      }
    }
      else{
        return undefined;
      }
  }

  //Méthode qui appelle le back pour la modification du mot de passe de l'utilisateur non connecté
  updatePasswordWithoutLogin(
    newPassword: { new_password: string },
    idUser: { id: string },
    userToken:string
  ) {
    const request = new HttpHeaders({
      Authorization: `${userToken}`,
    });
    return this.http.put(`${userEndpoint}/${idUser.id}/password`, newPassword, {
      headers: request,
    });
  }

  //Méthode qui appelle le back pour la modification du mot de passe de l'utilisateur
  updatePassword(password: Password) {
    return this.http.patch(
      `${userEndpoint}/${this.currentLoggedUser.value.id}/password`,
      password
    );
  }
}
