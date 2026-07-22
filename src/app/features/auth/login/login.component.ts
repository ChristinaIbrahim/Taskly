import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Router, RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

export interface LoginResponse {
  access_token?: string;
  [key: string]: unknown;
}

export interface AuthError {
  status?: number;
  message?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AuthContainerComponent,
    FormFieldComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.initForm();

    if (
      window.location.hash &&
      window.location.hash.includes('access_token=')
    ) {
      const currentHash = window.location.hash;
      this.router.navigateByUrl(`/reset-password${currentHash}`);
      return;
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/projects'], { replaceUrl: true });
      return;
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res: unknown) => {
        const response = res as LoginResponse;
        this.isLoading = false;
        if (response && response.access_token) {
          this.authService.saveToken(response.access_token);
          console.log('Login successful!', response);
          this.router.navigate(['/project']);
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
      },
      error: (err: unknown) => {
        const error = err as AuthError;
        this.isLoading = false;
        console.error('Login failed', error);
        if (
          error.status === 400 ||
          error.status === 401 ||
          error.status === 403
        ) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage =
            'Something went wrong. Please check your connection or try again later.';
        }
      },
    });
  }
}