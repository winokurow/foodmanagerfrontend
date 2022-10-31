import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Place } from '@app/_models/place';

@Injectable({ providedIn: 'root' })
export class PlacesService {
    private _places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
    readonly places: Observable<Place[]>  = this._places.asObservable();
    constructor(private http: HttpClient) {
      this.fetchPlaces();
    }

    public get getPlaces(): Place[] {
        return this._places.value;
    }

    fetchPlaces() {
      return this.http.get<Place[]>(`${environment.apiUrl}/api/places`).subscribe(
        data => {
          console.log("data" + data);
          this._places.next(data);
        },
        error => console.log('Could not load places.')
      );
    }


}
