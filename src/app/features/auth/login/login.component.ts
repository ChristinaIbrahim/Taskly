import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // 🚀 اتأكدي من المسار ده بالظبط عندك
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,         
    ReactiveFormsModule,   
    RouterModule,         
    AuthContainerComponent, 
    FormFieldComponent,
    SignupComponent  
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      this.router.navigate(['/projects']); 
    }

    this.initForm();
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]],
      rememberMe: [false] 
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response && response.access_token) {
          this.authService.saveToken(response.access_token, rememberMe);
        }

        console.log('Login successful!', response);
        this.router.navigate(['/projects']); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login failed', err);
        
        if (err.status === 400) {
          this.errorMessage = err.error?.error_description || 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please check your connection or try again later.';
        }
      }
    });
  }
}