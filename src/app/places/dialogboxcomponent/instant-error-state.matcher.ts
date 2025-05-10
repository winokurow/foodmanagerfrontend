import {ErrorStateMatcher} from '@angular/material/core';
import {AbstractControl, FormGroupDirective, NgForm} from '@angular/forms';

export class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    /* show the error as soon as the control has any validation error */
    return !!(control && control.invalid);
  }
}
