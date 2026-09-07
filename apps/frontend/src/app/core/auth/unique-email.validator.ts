import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Validateur asynchrone : vérifie que l'email n'est pas déjà utilisé.
 *
 * Changements vs v14 :
 * - inject() au lieu du constructeur
 * - Utilise AuthService.isEmailTaken() → POST /api/auth/check-email
 *   (l'ancienne version appelait HEAD /api/v1/mails/:mail qui n'existe plus)
 * - currentMail permet d'ignorer l'email actuel de l'utilisateur
 *   lors d'une modification de profil (évite le faux positif)
 *
 * Usage dans un formulaire réactif :
 *   email: ['', {
 *     validators: [Validators.required, Validators.email],
 *     asyncValidators: [inject(UniqueEmailValidator).validate.bind(...)],
 *     updateOn: 'blur'
 *   }]
 *
 * Erreur retournée : { emailTaken: true }
 */
@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  private readonly authService = inject(AuthService);

  /**
   * Email à ignorer lors de la validation.
   * Positionner avant d'attacher le validateur pour les formulaires d'édition.
   * Exemple : this.uniqueEmailValidator.currentEmail = this.user().email;
   */
  currentEmail = '';

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const value: string = control.value?.trim();

    // Ne valide pas si vide ou si c'est l'email actuel de l'utilisateur
    if (!value || value === this.currentEmail) {
      return of(null);
    }

    return this.authService.isEmailTaken(value).pipe(
      map((response) => (response.status === 200 ? { emailTaken: true } : null)),
      catchError(() => of(null)) // En cas d'erreur réseau, on ne bloque pas
    );
  }
}