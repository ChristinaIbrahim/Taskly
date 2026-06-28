import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , LoginComponent,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signUpForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[\p{L} ]+$/u),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        jobTitle: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: (control: AbstractControl) => {
          const password = control.get('password')?.value;
          const confirmPassword = control.get('confirmPassword')?.value;
          return password === confirmPassword
            ? null
            : { passwordMismatch: true };
        },
      },
    );
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('Sending Data to Supabase...', this.signUpForm.value);

      this.authService.signUp(this.signUpForm.value).subscribe({
        next: (res: any) => {
          console.log('Account Created ', res);

          if (res.access_token) {
            this.authService.saveToken(res.access_token, false);
          }

          this.router.navigate(['/project']);
        },
        error: (err) => {
          console.error('Account Not Created', err);
        }
      });

    } else {
      console.log('');
    }
  }
}