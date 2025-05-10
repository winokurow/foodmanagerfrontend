import { Component } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { AuthService } from './_services/auth.service';
import {Subscription} from 'rxjs';


@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user: User | null = null;
  private userSub: Subscription;

  constructor(private authService: AuthService) {
    this.userSub = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
