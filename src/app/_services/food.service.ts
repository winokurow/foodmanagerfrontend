import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Food } from '@app/_models/food';

@Injectable({ providedIn: 'root' })
export class FoodService {
    private _food: BehaviorSubject<Food[]> = new BehaviorSubject<Food[]>([]);
    readonly food = this._food.asObservable();

    constructor(private http: HttpClient) {}

    fetchFood() {
      this.http.get<Food[]>(`${environment.apiUrl}/api/food`).subscribe(
        data => {
          this._food.next(data);
          error => console.log(data);
        },
        error => console.log('Could not load food.')
      );
    }
}
