import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FoodService } from '@app/_services/food.service';
import { first } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Food } from '@app/_models/food';
import {MatTableModule} from '@angular/material/table'
import { DialogBoxComponent } from '@app/dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.css' ]
 })
export class HomeComponent implements AfterViewInit {

  options={
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  displayedColumns = ['name', 'quantity', 'description', 'placeName', 'validDate', 'alarmDate'];
  dataSource: MatTableDataSource<Food>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  food=[];

  constructor(private foodService: FoodService, public dialog: MatDialog) {
    this.foodService.fetchFood()
        .pipe(first())
        .subscribe(food => {
          this.food = food
          this.dataSource = new MatTableDataSource(this.food);
          console.log("Data SOurce1" + JSON.stringify(food, null, 4))
          console.log(Array.isArray(food))
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          //console.log("Data SOurce2" + JSON.stringify(this.dataSource, null, 4))

        });

  }

  ngAfterViewInit() {

  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        //this.addRowData(result.data);
      }else if(result.event == 'Update'){
        //this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        //this.deleteRowData(result.data);
      }
    });
  }
}
