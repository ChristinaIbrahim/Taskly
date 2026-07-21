import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AuthContainerComponent,
    FormFieldComponent,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (
      window.location.hash &&
      window.location.hash.includes('access_token=')
    ) {
      const currentHash = window.location.hash;
      this.router.navigateByUrl(`/reset-password${currentHash}`);
      return;
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/projects']);
      return;
    }
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.access_token) {
          // تم تعديلها لتأخذ وسيطاً واحداً فقط كما تم تحديثه في AuthService
          this.authService.saveToken(response.access_token);
          console.log('Login successful!', response);
          this.router.navigate(['/project']);
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
      },
      // تم إضافة نوع 'any' لحل خطأ TS7006
      error: (err: any) => {
        this.isLoading = false;
        console.error('Login failed', err);
        if (err.status === 400 || err.status === 401 || err.status === 403) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage =
            'Something went wrong. Please check your connection or try again later.';
        }
      },
    });
  }
}
