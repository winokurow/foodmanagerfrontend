import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Place } from '@app/_models/place';

@Injectable({ providedIn: 'root' })
export class PlacesService {
    private placeSubject: BehaviorSubject<Place>;
    public places: Observable<Place>;

    constructor(private http: HttpClient) {}

    public get getPlaces(): Place {
        return this.placeSubject.value;
    }

    fetchPlaces() {
      return this.http.get<Place[]>(`${environment.apiUrl}/api/places`);
    }


}
