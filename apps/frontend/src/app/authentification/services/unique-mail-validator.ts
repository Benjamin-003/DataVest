import { UserService } from '../../users/services/user-service.service';
import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, map, catchError, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UniqueMailValidator implements AsyncValidator {
  currentMail = ""

  constructor(private readonly userService: UserService) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value && control.value !== this.currentMail) {
      return this.userService.isMailTaken(control.value).pipe(
        map(status => (status === 200 ? { uniqueMail: true } : null)),
        catchError(() => of(null))
      );
    }
    return of(null);
  }
}

