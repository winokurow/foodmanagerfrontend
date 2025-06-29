import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FoodStockService } from '@app/_services/foodstock.service';
import { FoodStock } from '@app/_models/foodStock';
import {FoodDialogBoxComponent} from '@app/home/dialogboxcomponent/food-dialog-box.component';
@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.css' ]
 })
export class HomeComponent implements AfterViewInit {
  displayedColumns = [
    'food.name', 'quantity', 'food.description',
    'place.name', 'validDate', 'alarmDate', 'action'
  ];
  dataSource = new MatTableDataSource<FoodStock>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(
    private foodStockService: FoodStockService,
    private dialog: MatDialog
  ) {
    /* live data */
    this.foodStockService.stocks.subscribe(list => {
      this.dataSource.data = list;
    });

    /* let MatTable sort by nested props like 'food.name' */
    this.dataSource.sortingDataAccessor = (item, prop) => {
      return prop.split('.').reduce<any>((obj, key) => obj?.[key], item);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  /* --------------------- dialog handlers --------------------- */
  openAddDialog() { this.openDialog('Add', {} as FoodStock); }

  openDialog(action: 'Add' | 'Update' | 'Delete', stock: FoodStock) {
    const ref = this.dialog.open(FoodDialogBoxComponent, {
      width: '360px',
      data: { action, foodStock: { ...stock } }
    });

    ref.afterClosed().subscribe(async res => {
      if (!res) { return; }

      try {
        if (res.event === 'Add') {      await this.foodStockService.add(res.data); }
        else if (res.event === 'Update') { await this.foodStockService.update(res.data.id, res.data); }
        else if (res.event === 'Delete') { await this.foodStockService.remove(res.data.id); }
      } catch (e) {
        console.error(e);                          // snackbar here
      }
    });
  }
}
