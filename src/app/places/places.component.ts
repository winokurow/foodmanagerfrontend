import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBoxComponent } from '@app/dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Place } from '@app/_models/place';
import { PlacesService } from '@app/_services/places.service';

@Component({
  templateUrl: 'places.component.html',
  styleUrls: [ './places.component.css' ]
 })
export class PlacesComponent implements AfterViewInit {

  options = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  displayedColumns = ['name', 'action'];
  dataSource: MatTableDataSource<Place>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  places: Place[] = [];

  constructor(private placesService: PlacesService, public dialog: MatDialog) {

    placesService.places.subscribe(updatedPlaces => {
      this.places = updatedPlaces;
      this.dataSource = new MatTableDataSource(this.places);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


  }
  ngAfterViewInit(): void {
  }

  openAddDialog() {

  }
}
