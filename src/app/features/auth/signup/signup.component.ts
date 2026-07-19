import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
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
    FormFieldComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage = '';
  isLoading = false;
  isSuccess = false; 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.unicodeNameValidator]],
        email: ['', [Validators.required, Validators.email]],
        jobTitle: [''],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64), Validators.pattern(/^[^\s]*$/), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get passwordValue(): string { return this.signupForm?.get('password')?.value || ''; }
  get hasMinLength(): boolean { return this.passwordValue.length >= 8; }
  get hasUpperLowerDigit(): boolean { return /[A-Z]/.test(this.passwordValue) && /[a-z]/.test(this.passwordValue) && /[0-9]/.test(this.passwordValue); }
  get hasSpecialChar(): boolean { return /[!@#$%^&*]/.test(this.passwordValue); }

  unicodeNameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^(?!.* {2})[\p{L}]+( [\p{L}]+)*$/u;
    return !control.value || nameRegex.test(control.value) ? null : { invalidName: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getError(controlName: string): string {
    const control = this.signupForm?.get(controlName);
    if (controlName === 'confirmPassword' && this.signupForm?.hasError('passwordMismatch') && control?.touched) return 'Passwords do not match.';
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    return '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signUp(this.signupForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true; 
        setTimeout(() => {
          this.router.navigate(['/projects']); 
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Signup failed.';
      },
    });
  }
}