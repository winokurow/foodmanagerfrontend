import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Food } from '@app/_models/food';
import { FoodStock } from '@app/_models/foodStock';

@Injectable({ providedIn: 'root' })
export class FoodStockService {
    private _foodStock: BehaviorSubject<FoodStock[]> = new BehaviorSubject<FoodStock[]>([]);
    readonly foodStock = this._foodStock.asObservable();

    constructor(private http: HttpClient) {}

    public get getFoodStock() {
      return this._foodStock.value;
    }

    public nextFoodStock(foodStock: FoodStock[]) {
      return this._foodStock.next(foodStock);
    }

    fetchFoodStock() {
      this.http.get<FoodStock[]>(`${environment.apiUrl}/api/food-stock`).subscribe(
        data => {
          this._foodStock.next(data);
        },
        error => console.log('Could not load food.')
      );
    }

    saveFoodStock(foodStock: FoodStock) {
      return this.http.post(`${environment.apiUrl}/api/food-stock`, foodStock);
    }

    updateFoodStock(foodStock: FoodStock) {
      console.log("foodStock" + foodStock);
      return this.http.put(`${environment.apiUrl}/api/food-stock`, foodStock);
    }

    deleteFoodStock(id: number) {
      return this.http.delete(`${environment.apiUrl}/api/food-stock/` + id);
    }
}
