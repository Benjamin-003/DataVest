import { UserService } from 'src/app/users/services/user-service.service';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationGuard  {
  constructor(private readonly userService: UserService, private readonly route: Router) { }
  canActivate(): true|UrlTree {
    if (this.userService.token) {
      return true
    }
    else {
      return this.route.parseUrl("authentication/connexion")
    }
  }
}
