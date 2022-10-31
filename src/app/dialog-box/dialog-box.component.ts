import { OnInit } from '@angular/core';
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Food } from '@app/_models/food';
import { FoodStock } from '@app/_models/foodStock';
import { Place } from '@app/_models/place';
import { FoodService } from '@app/_services/food.service';
import { PlacesService } from '@app/_services/places.service';
import { first } from 'rxjs';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit{

  action: string;
  places: Place[] = [];
  food = new Map();
  names: string[] = [];
  localData;
  filteredNames: string[];
  titleMap = new Map([
    ['Add', 'Insert food']
]);

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, private placesService: PlacesService, private foodService: FoodService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Food) {

      this.localData = {...data};
      this.action = this.localData.action;

      if (this.action === 'Add') {
        this.localData.foodStock = new FoodStock();
        this.localData.foodStock.food = new Food();
        this.localData.foodStock.place = new Place();
      }

      console.log(this.localData);

    }
  ngOnInit(): void {
    this.placesService.places
    .subscribe(places => {
      this.places = places;
      console.log(this.places[0].name);
      this.localData.foodStock.place.id = this.places[0].id;
    });
    this.foodService.fetchFood();
    this.foodService.food.subscribe(updatedFood => {
      this.food = new Map(updatedFood.map(key => [key.name, key]));
      this.names = updatedFood.map(a => a.name);
    });


  }
  setParams(name: string) {
    console.log(name);
    this.localData.foodStock.food.description = this.food.get(name).description;
    this.localData.foodStock.food.units = this.food.get(name).units;
  }

  doAction(){
    console.log(this.localData);
    this.dialogRef.close({event: this.action, data: this.localData.foodStock});
  }

  closeDialog(): void{

    this.dialogRef.close({event: 'Cancel'});
  }

  filter(value: string) {
    this.filteredNames = this._filter(value);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }
}
