import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        Validators.pattern(/^[^\s]*$/), // بدون مسافات
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // الـ Getters المسؤولة عن تلوين الـ Checklist في الـ HTML تلقائياً
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
    // رموز خاصة مثل !@#$%^&*
    return /[!@#$%^&*]/.test(this.passwordValue);
  }

  // Validator الاسم
  unicodeNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const nameRegex = /^(?!.* {2})[\p{L}]+( [\p{L}]+)*$/u;
    return nameRegex.test(control.value) ? null : { invalidName: true };
  }

  // Validator تطابق كلمتي المرور
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const body = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      data: {
        name: this.signupForm.value.name,
        job_title: this.signupForm.value.jobTitle || ''
      }
    };

    this.http.post('/auth/v1/signup', body).subscribe({
      next: () => {
        this.router.navigate(['/project']);
      },
      error: (err) => {
        console.error('Signup failed', err);
      }
    });
  }
}