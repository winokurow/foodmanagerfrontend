import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '@app/_services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent {
  errorMessage: string | null = null;
  infoMessage: string | null = null;
  accessToken: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Supabase sends a query parameter 'access_token'
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'];
    });
  }

  async onSubmit(form: NgForm) {
    // You would call an endpoint here to update the password using the access token.
    // This is a placeholder for demonstration purposes.
    if (form.valid) {
      const { password } = form.value;
      // Implement your update password logic with Supabase API if needed
      this.infoMessage = 'Password updated successfully. Please login with your new password.';
      this.router.navigate(['/login']);
    }
  }
}
