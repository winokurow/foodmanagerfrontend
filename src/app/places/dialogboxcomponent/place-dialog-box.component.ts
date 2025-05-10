import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlacesService} from '@app/_services/places.service';
import {map} from 'rxjs';
import {InstantErrorStateMatcher} from '@app/places/dialogboxcomponent/instant-error-state.matcher';

export interface DialogData {
  action: 'Add' | 'Edit';
  record: { id?: number; name: string };
}

@Component({
  selector: 'place-app-dialog-box',
  templateUrl: './place-dialog-box.component.html',
})
export class PlaceDialogBoxComponent {
  form: FormGroup;
  errorMatcher = new InstantErrorStateMatcher();
  constructor(
    private fb: FormBuilder,
    private places: PlacesService,
    public  dialogRef: MatDialogRef<PlaceDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      name: [
        data.record.name,
        {
          validators: [Validators.required, Validators.maxLength(64)],
          asyncValidators: [this.uniqueNameValidator()]
        },
      ],
    });
  }

  /** Async validator factory – closes over PlacesService & current id */
  private uniqueNameValidator(): AsyncValidatorFn {
    return (ctrl: AbstractControl) =>
      this.places
        .checkNameTaken$(ctrl.value, this.data.record.id)
        .pipe(map(taken => (taken ? { nameTaken: true } : null)));
  }

  save() {
    if (this.form.invalid) { return; }     // should never happen; button is disabled
    this.dialogRef.close({
      event : this.data.action,
      record: { ...this.data.record, ...this.form.value },
    });
  }
}
