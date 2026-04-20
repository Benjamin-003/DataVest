import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UserService } from 'src/app/users/services/user-service.service';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordGuard  {
  constructor(private readonly userService: UserService, private readonly router: Router) { }
  canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
  ): true | UrlTree {
    if (
      this.userService.getIDIntoRefreshToken(
        activatedRouteSnapshot.params['token']
      )
    )
      {
        return true;
      }
    else
      {
      return this.router.parseUrl('authentication/password');
      }
  }
}
