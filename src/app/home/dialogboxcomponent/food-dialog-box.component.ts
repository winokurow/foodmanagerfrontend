import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlacesService} from '@app/_services/places.service';
import {map} from 'rxjs';
import {Food} from '@app/_models/food';
import {Place} from '@app/_models/place';
import {FoodService} from '@app/_services/food.service';
import {FoodStock} from '@app/_models/foodStock';
import {debounceTime, first} from 'rxjs/operators';

export interface DialogData {
  action: 'Add' | 'Update' | 'Delete';
  foodStock: FoodStock | null;          // null when adding
}

@Component({
  selector: 'food-app-dialog-box',
  styleUrls: ['./food-dialog-box.component.scss'],
  templateUrl: './food-dialog-box.component.html',
})
export class FoodDialogBoxComponent {
  /* --------------- state --------------- */
  form!: FormGroup;

  foods: Food[]  = [];
  places: Place[] = [];

  filteredFoodNames: string[] = [];

  /** satisfies `[displayWith]="displayFoodName"` */
  displayFoodName = (value?: string): string => value ?? '';

  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
    private placesService: PlacesService,
    private dialogRef: MatDialogRef<FoodDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /* --------------- lifecycle --------------- */
  ngOnInit(): void {

    /* reference data ------------------------------------------------------- */
    this.foodService.foods.subscribe(f => {
      this.foods = f;
      this.filteredFoodNames = f.map(x => x.name);     // initial list
    });

    this.placesService.places.subscribe(p => (this.places = p));

    /* form ----------------------------------------------------------------- */
    const fs = this.data.foodStock;

    this.form = this.fb.group({
      foodName: [
        fs?.food?.name ?? '',
        {
          validators:      [Validators.required, Validators.maxLength(64)],
          asyncValidators: [this.uniqueFoodNameValidator(fs?.food?.id)],
          updateOn: 'change'
        }
      ],
      description: [fs?.food?.description ?? ''],
      unit:        [fs?.food?.unit ?? 'pcs', Validators.required],
      placeId:     [fs?.place?.id ?? null, Validators.required],
      quantity:    [fs?.quantity ?? 1, [Validators.required, Validators.min(0.01)]],
      validDate:   [fs?.validDate ?? null],
      alarmDate:   [fs?.alarmDate ?? null]
    });

    /* autocomplete filter */
    this.form.get('foodName')!.valueChanges
      .pipe(debounceTime(120))
      .subscribe(val => this.filterFoods(val));
  }

  /* --------------- validators & helpers --------------- */
  private filterFoods(val: string) {
    const needle = (val || '').toLowerCase();
    this.filteredFoodNames = this.foods
      .map(f => f.name)
      .filter(name => name.toLowerCase().includes(needle));
  }

  /** async validator → food name must be unique */
  private uniqueFoodNameValidator(existingId?: string): AsyncValidatorFn {
    return (ctrl: AbstractControl) =>
      this.foodService.checkNameTaken$(ctrl.value, existingId).pipe(
        map(taken => (taken ? { nameTaken: true } : null)),
        first()
      );
  }

  /* --------------- actions --------------- */
  save(): void {
    if (this.form.invalid) { return; }

    const v = this.form.value;

    /* find or create the Food row */
    let food = this.foods.find(
      f => f.name.toLowerCase() === v.foodName.toLowerCase()
    );
    if (!food) {
      food = {
        id: '',                       // Supabase will generate one after insert
        name: v.foodName,
        description: v.description,
        unit: v.unit
      };
    }

    const payload: FoodStock = {
      ...(this.data.foodStock ?? {} as FoodStock),
      food,
      quantity : v.quantity,
      place    : this.places.find(p => p.id === v.placeId)!,
      validDate: v.validDate,
      alarmDate: v.alarmDate
    };

    this.dialogRef.close({ event: this.data.action, data: payload });
  }

  delete(): void {
    this.dialogRef.close({ event: 'Delete', data: this.data.foodStock });
  }

  cancel(): void { this.dialogRef.close(); }
}
