import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgForm, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '@app/_services/auth.service';
import { AlertService } from '@app/_services/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html' })
export class LoginComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password } = form.value;
      const { error } = await this.authService.login(email, password);
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.router.navigate(['/protected']);
      }
    }
  }
}
