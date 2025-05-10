import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

import { environment } from '@environments/environment';
import {createClient, SupabaseClient, User} from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

    constructor(
        private router: Router
    ) {
      console.log('AuthService');
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      console.log(this.supabase);
      // Check session on load (optional)
      this.initializeUser();
      this.listenToAuthChanges();
    }



  private async initializeUser(): Promise<void> {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.userSubject.next(session.user);
    }
  }

  private listenToAuthChanges(): void {
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data?.user) {
      this.userSubject.next(data.user);
    }
    return { data, error };
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (!error) {
      this.userSubject.next(null);
      this.router.navigate(['/login']);
    }
    return { error };
  }

  async resetPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password'
    });
    return { data, error };
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
