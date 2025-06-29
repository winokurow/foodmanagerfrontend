import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Place } from '@app/_models/place';
import { PlacesService } from '@app/_services/places.service';
import {PlaceDialogBoxComponent} from '@app/places/dialogboxcomponent/place-dialog-box.component';

@Component({
  templateUrl: 'places.component.html',
  styleUrls: [ './places.component.css' ]
 })
export class PlacesComponent implements AfterViewInit {
  displayedColumns = ['name', 'action'];
  dataSource = new MatTableDataSource<Place>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(
    private placesService: PlacesService,
    private dialog: MatDialog
  ) {
    // live data
    this.placesService.places.subscribe(list => {
      this.dataSource.data = list;
      // paginator/sort can be undefined the first tick
      if (this.paginator) { this.dataSource.paginator = this.paginator; }
      if (this.sort) {      this.dataSource.sort      = this.sort; }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  /* ---------- dialogs ---------- */
  openAddDialog() {
    const ref = this.dialog.open(PlaceDialogBoxComponent, {
      width: '350px',
      data: { action: 'Add', record: { name: '' } }
    });

    ref.afterClosed().subscribe(async res => {
      if (res?.event === 'Add') { await this.placesService.add(res.record); }
    });
  }

  openEditDialog(place: Place) {
    const ref = this.dialog.open(PlaceDialogBoxComponent, {
      width: '350px',
      data: { action: 'Edit', record: { ...place } }
    });

    ref.afterClosed().subscribe(async res => {
      if (res?.event === 'Edit')
        await this.placesService.update(place.id, res.record);
    });
  }

  async deletePlace(id: number) {
    if (confirm('Really delete this place?')) {
      await this.placesService.remove(id);
    }
  }
}
