import { Component, ViewChild } from '@angular/core';
import { FoodService } from '@app/_services/food.service';
import { first } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Food } from '@app/_models/food';
import {MatTableModule} from '@angular/material/table'
@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.css' ]
 })
export class HomeComponent {

  options={
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  food = null

  displayedColumns = ['name', 'quantity', 'description', 'placeName', 'validDate', 'alarmDate'];
  dataSource: MatTableDataSource<Food>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.foodService.fetchFood()
        .pipe(first())
        .subscribe(food => this.food = food);
    this.dataSource = new MatTableDataSource(this.food);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addbut(){
    window.alert("addbutton");
  }
  editbut(){
    window.alert("editbutton");
  }
}
