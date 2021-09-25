import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Food } from '@app/_models/food';

@Injectable({ providedIn: 'root' })
export class FoodService {
    private foodSubject: BehaviorSubject<Food>;
    public food: Observable<Food>;

    constructor(private http: HttpClient) {}

    public get getFood(): Food {
        return this.foodSubject.value;
    }

    fetchFood() {
      return this.http.get<Food[]>(`${environment.apiUrl}/api/food`);
    }


}
