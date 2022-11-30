import { UserService } from './user-service.service';
import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, map, catchError, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UniqueMailValidator implements AsyncValidator {
  constructor(private readonly userService:UserService) {}

  validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.userService.isMailTaken(control.value).pipe(
      map(status => (status===200 ? { uniqueMail: true } : null)),
      catchError(() => of(null))
    );
  }
}
