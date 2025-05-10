// src/app/_services/places.service.ts
import { Injectable } from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Place } from '@app/_models/place';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private supabase: SupabaseClient;
  private places$ = new BehaviorSubject<Place[]>([]);
  readonly places = this.places$.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.refresh();
  }

  /** Handy getter for synchronous reads (e.g. inside a guard). */
  get snapshot(): Place[] {
    return this.places$.value;
  }

  // tslint:disable-next-line:typedef
  private async refresh() {
    const { data, error } = await this.supabase
      .from('places')
      .select('*')
      .order('name');
    if (error) { console.error(error); return; }
    this.places$.next(data as Place[]);
  }

  /* ---------- CRUD wrappers ---------- */
  async add(place: Omit<Place, 'id'>) {
    const { data, error } = await this.supabase
      .from('places')
      .insert(place)
      .select()
      .single();

    if (error) {
      console.error('Add failed:', error);
      throw error;
    }

    // update the local cache
    this.places$.next([...this.places$.value, data as Place]);
    return data as Place;
  }

  async update(id: number, changes: Partial<Place>) {
    const { data, error } = await this.supabase
      .from('places')
      .update(changes)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update failed:', error);
      throw error;
    }

    this.places$.next(
      this.places$.value.map(p => (p.id === id ? (data as Place) : p))
    );
    return data as Place;
  }

  async remove(id: number) {
    const { error } = await this.supabase
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete failed:', error);
      throw error;
    }

    this.places$.next(this.places$.value.filter(p => p.id !== id));
  }

  /** TRUE if another Place already has this name (case-insensitive) */
  isNameTaken(name: string, exceptId?: number) {
    return this.snapshot.some(
      p => p.name.toLowerCase() === name.toLowerCase() && p.id !== exceptId
    );
  }

  /** Async wrapper that fits Angular’s AsyncValidatorFn signature */
  checkNameTaken$(name: string, exceptId?: number) {
    return of(this.isNameTaken(name, exceptId));   // emits once and completes
  }
}
