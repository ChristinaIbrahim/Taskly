import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthContainerComponent,
    AppIconsDirective,
    FormFieldComponent 
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordVisible = false; 
  confirmPasswordVisible = false; 
  errorMessage = ''; 
  isLoading = false;  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      const currentHash = window.location.hash;
      this.router.navigateByUrl(`/reset-password${currentHash}`);
      return; 
    }

    this.signupForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.unicodeNameValidator
      ]],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        Validators.pattern(/^[^\s]*$/), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  get passwordValue(): string {
    return this.signupForm?.get('password')?.value || '';
  }

  get hasMinLength(): boolean {
    return this.passwordValue.length >= 8 && this.passwordValue.length <= 64;
  }

  get hasUpperLowerDigit(): boolean {
    const hasUpper = /[A-Z]/.test(this.passwordValue);
    const hasLower = /[a-z]/.test(this.passwordValue);
    const hasDigit = /[0-9]/.test(this.passwordValue);
    return hasUpper && hasLower && hasDigit;
  }

  get hasSpecialChar(): boolean {
    return /[!@#$%^&*]/.test(this.passwordValue);
  }

  unicodeNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const nameRegex = /^(?!.* {2})[\p{L}]+( [\p{L}]+)*$/u;
    return nameRegex.test(control.value) ? null : { invalidName: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getError(controlName: string): string {
    const control = this.signupForm?.get(controlName);
    
    if (controlName === 'confirmPassword' && this.signupForm?.hasError('passwordMismatch') && control?.touched) {
      return 'Passwords do not match.';
    }

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address.';
    }
    if (control.errors['invalidName']) {
      return '3-50 characters, letters only.';
    }
    if (control.errors['minlength']) {
      return `Must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control.errors['pattern']) {
      return 'Password does not meet the requirements.';
    }

    return '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const signUpData = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      jobTitle: this.signupForm.value.jobTitle
    };

    this.authService.signUp(signUpData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('Signup success:', res);
        this.router.navigate(['/projects']); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Signup failed', err);
        this.errorMessage = err.error?.error_description || err.error?.message || 'Signup failed, please try again.';
      }
    });
  }
}