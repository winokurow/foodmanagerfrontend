import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgForm, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { AlertService } from '@app/_services/alert.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  errorMessage: string | null = null;
  infoMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;
      const { error, data } = await this.authService.register(email, password);
      if (error) {
        this.errorMessage = error.message;
      } else {
        // In Supabase email verification is usually handled via email.
        this.infoMessage =
          'Registration successful. Please check your email for verification.';
      }
    }
  }
}
