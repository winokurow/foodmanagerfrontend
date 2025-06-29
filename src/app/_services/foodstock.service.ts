import {Injectable} from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {FoodStock} from '@app/_models/foodStock';
import {environment} from '@environments/environment';
import {Food} from '@app/_models/food';

@Injectable({ providedIn: 'root' })
export class FoodStockService {

  private supabase: SupabaseClient;
  private stocks$ = new BehaviorSubject<FoodStock[]>([]);
  readonly stocks: Observable<FoodStock[]> = this.stocks$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.refresh();                       // initial load
  }

  /* -------------------- helpers -------------------- */
  private async refresh() {
    const { data, error } = await this.supabase
      .from('food_stock_complete')        // the view
      .select('*')
      .order('valid_date', { ascending: true });

    if (error) { console.error(error); return; }
    this.stocks$.next(data as FoodStock[]);
  }
  private get snapshot() { return this.stocks$.value; }

  private async resolveFoodId(food: Food): Promise<String> {
    // if it already has a valid numeric id, use it
    const maybeId = food.id;
    if (!maybeId) {
      return maybeId;
    }
    // otherwise insert a new food record
    const { data: newFood, error: foodErr } = await this.supabase
      .from('food')
      .insert({
        name:        food.name,
        description: food.description,
        unit:        food.unit
      })
      .select()
      .single();
    if (foodErr) throw foodErr;
    return (newFood as Food).id;
  }

  /* -------------------- CRUD ----------------------- */
  async add(stock: Omit<FoodStock, 'id'>): Promise<FoodStock> {
    // 1) If this is a brand-new food (no numeric id), create it first
    const foodId = await this.resolveFoodId(stock.food);

    // 2) Now insert the food_stock row with a valid bigint food_id
    const { data, error } = await this.supabase
      .from('food_stock')
      .insert({
        food_id:    foodId,
        place_id:   stock.place.id,
        quantity:   stock.quantity,
        valid_date: stock.validDate,
        alarm_date: stock.alarmDate
      })
      .select('*, food:food(*), place:places(*)')
      .single();

    if (error) throw error;
    this.stocks$.next([...this.snapshot, data as FoodStock]);
    return data as FoodStock;
  }

  async update(id: number, changes: Partial<FoodStock>): Promise<FoodStock> {
    // 1) find the original row
    const orig = this.snapshot.find(s => s.id === id);
    if (!orig) throw new Error(`No FoodStock with id=${id} in cache`);

    let updatedFood = orig.food;
    let updatedStock: FoodStock | null = null;

    // 2) check if any Food fields changed
    const foodChanges: Partial<Food> = {};
    if (changes.food) {
      const c = changes.food!;
      if (c.name        != null && c.name        !== orig.food.name)        foodChanges.name        = c.name;
      if (c.description != null && c.description !== orig.food.description) foodChanges.description = c.description;
      if (c.unit        != null && c.unit        !== orig.food.unit)        foodChanges.unit        = c.unit;
    }

    if (Object.keys(foodChanges).length > 0) {
      // push update to the food table
      const { data: fdata, error: ferr } = await this.supabase
        .from('food')
        .update(foodChanges)
        .eq('id', orig.food.id)
        .select()
        .single();

      if (ferr) throw ferr;
      updatedFood = fdata as Food;
    }

    // 3) check if any FoodStock fields changed
    const stockChanges: any = {};
    if (changes.quantity    != null && changes.quantity    !== orig.quantity)    stockChanges.quantity    = changes.quantity;
    if (changes.place?.id   != null && changes.place.id   !== orig.place.id)       stockChanges.place_id    = changes.place.id;
    if (changes.validDate   != null && +changes.validDate !== +orig.validDate)    stockChanges.valid_date  = changes.validDate;
    if (changes.alarmDate   != null && +changes.alarmDate !== +orig.alarmDate)    stockChanges.alarm_date  = changes.alarmDate;

    if (Object.keys(stockChanges).length > 0) {
      // push update to the food_stock table
      const { data: sdata, error: serr } = await this.supabase
        .from('food_stock')
        .update(stockChanges)
        .eq('id', id)
        // re-join to get full Food & Place objects back
        .select('*, food:food(*), place:places(*)')
        .single();

      if (serr) throw serr;
      updatedStock = sdata as FoodStock;
    }

    // 4) assemble the new full record
    const result: FoodStock = updatedStock
      ? updatedStock
      : { ...orig, food: updatedFood };

    // 5) patch the in-memory list
    this.stocks$.next(
      this.snapshot.map(s => (s.id === id ? result : s))
    );

    return result;
  }

  async remove(id: number) {
    const { error } = await this.supabase
      .from('food_stock')
      .delete()
      .eq('id', id);

    if (error) throw error;
    this.stocks$.next(this.snapshot.filter(s => s.id !== id));
  }

  /* -------------------- sync uniqueness helper -------------------- */
  isNameTaken(foodName: string, exceptId?: number) {
    return this.snapshot.some(
      s => s.food.name.toLowerCase() === foodName.toLowerCase() && s.id !== exceptId
    );
  }
  checkNameTaken$(n: string, id?: number) { return of(this.isNameTaken(n, id)); }
}
