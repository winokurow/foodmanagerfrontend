import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '@app/_services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  errorMessage: string | null = null;
  infoMessage: string | null = null;

  constructor(private authService: AuthService) {}

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const { email } = form.value;
      const { error } = await this.authService.resetPassword(email);
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.infoMessage =
          'If an account exists for that email, a reset link has been sent.';
      }
    }
  }
}
