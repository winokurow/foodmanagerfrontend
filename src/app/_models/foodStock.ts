import {Food} from '@app/_models/food';
import {Place} from '@app/_models/place';

export class FoodStock {
  id: number;
  food: Food;
  place: Place;
  quantity: number;
  validDate: Date;
  alarmDate: Date;
}
