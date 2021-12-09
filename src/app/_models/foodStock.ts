import { Food } from "./food";
import { Place } from "./place";

export class FoodStock {
  id: string;
  food: Food;
  place: Place;
  quantity: string;
  validDate: Date;
  alarmDate: Date;
}
