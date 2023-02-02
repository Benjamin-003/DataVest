import { UserService } from './user-service.service';
import { PersonalData } from '../interfaces/personal-data.model';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<PersonalData>{

  constructor(private readonly userService: UserService) { }
  public personalData!: Observable<PersonalData>
  //Recupère les informations du produit depuis la route et le renvoi au composant du détail d'un utilisateur.
  resolve(): Observable<PersonalData> | Observable<never> {
    this.userService.currentLoggedUser.subscribe(resultUser => {
      this.personalData = this.userService.getUser(resultUser.id).pipe(userRow => { return userRow }
      )
    })
    return this.personalData
  }
}

