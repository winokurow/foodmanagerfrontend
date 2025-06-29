import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';

import { environment } from '@environments/environment';
import { Food } from '@app/_models/food';
import {createClient, SupabaseClient} from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
@Injectable({ providedIn: 'root' })
export class FoodService {

  // ───────── private state ─────────
  private supabase: SupabaseClient;
  private foods$  = new BehaviorSubject<Food[]>([]);

  // ───────── public stream ─────────
  /** Subscribe to get the live list of foods. */
  readonly foods: Observable<Food[]> = this.foods$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.refresh();                           // initial load
  }

  // ────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────
  /** Reload everything from Supabase (rarely needed). */
  async refresh(): Promise<void> {
    const { data, error } = await this.supabase
      .from('food')
      .select('*')
      .order('name');

    if (error) {
      console.error('[Food] refresh() failed:', error);
      return;
    }
    this.foods$.next(data as Food[]);
  }

  /** Synchronous snapshot (useful in guards / validators). */
  private get snapshot(): Food[] {
    return this.foods$.value;
  }

  /** TRUE if another food already has this name (case-insensitive). */
  isNameTaken(name: string, exceptId?: string): boolean {
    return this.snapshot.some(
      f => f.name.toLowerCase() === name.toLowerCase() && f.id !== exceptId
    );
  }

  /** Async wrapper that fits Angular’s AsyncValidatorFn signature. */
  checkNameTaken$(name: string, exceptId?: string) {
    return of(this.isNameTaken(name, exceptId));   // emits once then completes
  }

  // ────────────────────────────────────────────────────────────
  // CRUD
  // ────────────────────────────────────────────────────────────
  /** CREATE */
  async add(food: Omit<Food, 'id'>): Promise<Food> {
    const { data, error } = await this.supabase
      .from('food')
      .insert(food)
      .select()
      .single();

    if (error) {
      console.error('[Food] add() failed:', error);
      throw error;
    }

    this.foods$.next([...this.snapshot, data as Food]);
    return data as Food;
  }

  /** UPDATE by id */
  async update(id: string, changes: Partial<Food>): Promise<Food> {
    const { data, error } = await this.supabase
      .from('food')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Food] update() failed:', error);
      throw error;
    }

    this.foods$.next(
      this.snapshot.map(f => (f.id === id ? (data as Food) : f))
    );
    return data as Food;
  }

  /** DELETE by id */
  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('food')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Food] remove() failed:', error);
      throw error;
    }

    this.foods$.next(this.snapshot.filter(f => f.id !== id));
  }
}
