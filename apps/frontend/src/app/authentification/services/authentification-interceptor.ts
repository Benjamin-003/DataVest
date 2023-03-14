import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/users/services/user-service.service';

@Injectable()
export class AuthentificationInterceptor implements HttpInterceptor {

  constructor(private readonly userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userToken = this.userService.token
    if (userToken) {
      //On clone la requête pour introduire le token dans l'entête
      request = request.clone({
        setHeaders: { Authorization:`${userToken}` }
      });
    }
    return next.handle(request);
  }
}

