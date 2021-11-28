import { NgZone } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Food } from '@app/_models/food';
import { Place } from '@app/_models/place';
import { FoodService } from '@app/_services/food.service';
import { PlacesService } from '@app/_services/places.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs';


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit{

  action: string;
  places: Place[] = [];
  names: string[] = [];
  local_data: any;
  filteredNames: string[];
  titleMap = new Map([
    ['Add', 'Insert food']
]);

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, private placesService: PlacesService, private foodService: FoodService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Food) {


      this.local_data = {...data};
      this.action = this.local_data.action;

    }
  ngOnInit(): void {
    this.placesService.fetchPlaces()
    .pipe(first())
    .subscribe(places => {
      this.places = places;
      console.log(this.places[0].name)
      this.local_data.placeId = this.places[0].id;
    });

    this.foodService.food.subscribe(updatedFood => {
      this.names = updatedFood.map(a => a.name);


    });


  }

  doAction(){
    console.log(this.local_data);
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog(): void{

    this.dialogRef.close({event: 'Cancel'});
  }

  filter(value: string) {
    console.log(value);
    this.filteredNames = this._filter(value);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }
}

export interface FoodInterface {
  name: string;
  quantity: string;
  description: string;
  placeName: string;
  validDate: Date;
  alarmDate: Date;
}
