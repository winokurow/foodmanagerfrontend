import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBoxComponent } from '@app/dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { FoodStockService } from '@app/_services/foodstock.service';
import { FoodStock } from '@app/_models/foodStock';
import { FoodService } from '@app/_services/food.service';
@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.css' ]
 })
export class HomeComponent implements AfterViewInit {

  options = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  displayedColumns = ['food.name', 'quantity', 'food.description', 'place.name', 'validDate', 'alarmDate', 'action'];
  dataSource: MatTableDataSource<FoodStock>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  foodStock = [];

  constructor(private foodStockService: FoodStockService, private foodService: FoodService, public dialog: MatDialog) {
    foodStockService.foodStock.subscribe(updatedFood => {
      this.foodStock = updatedFood;
      this.dataSource = new MatTableDataSource(this.foodStock);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }

  ngAfterViewInit() {

  }

  openAddDialog() {
    this.openDialog('Add', new FoodStock());
  }

  openDialog(action: string, foodStock : FoodStock) {
    let obj : {action: string, foodStock: FoodStock} = {"action": action, "foodStock": foodStock};
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data : obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.foodStockService.saveFoodStock(result.data).subscribe(data => {
          const newArray = [...this.foodStock];
          newArray.push(data);
          this.foodStockService.nextFoodStock(newArray);
        });
      }
      else if (result.event === 'Update'){
        console.log("UPDATE " + JSON.stringify(result.data));
        this.foodStockService.updateFoodStock(result.data).subscribe(data => {
          const newArray = [...this.foodStock];
          const objIndex = newArray.findIndex((obj => obj.id == result.data.id));
          newArray[objIndex] = data;
          this.foodStockService.nextFoodStock(newArray);
        }, error => {console.log(error); });
      } else if (result.event === 'Delete'){
        this.foodStockService.deleteFoodStock(result.data.id).subscribe(data => {
          const newArray = [...this.foodStock];
          const objIndex = newArray.findIndex((obj => obj.id == result.data.id));
          newArray.splice(objIndex, 1);
          this.foodStockService.nextFoodStock(newArray);
        }, error => {console.log(error); });
      }
    });
  }
}
