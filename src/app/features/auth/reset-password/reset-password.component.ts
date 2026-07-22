import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AppIconsDirective,
    FormFieldComponent,
    AuthContainerComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  resetForm!: FormGroup;
  isLoading = false;
  accessToken: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showPassword = false;

  passwordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  };

  private baseUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  ngOnInit(): void {
    this.initForm();
    this.extractTokenFromUrl();
  }

  initForm(): void {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,64}$/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    this.resetForm.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordRequirements(value || '');
    });
  }

  getControl(name: string): FormControl {
    return this.resetForm.get(name) as FormControl;
  }

  extractTokenFromUrl(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const token = params.get('access_token');

        if (token) {
          this.accessToken = token;
          this.errorMessage = null;
          return;
        }
      }

      const currentHash = window.location.hash;
      if (currentHash) {
        const cleanHash = currentHash.startsWith('#')
          ? currentHash.substring(1)
          : currentHash;
        const params = new URLSearchParams(cleanHash);
        const token = params.get('access_token');

        if (token) {
          this.accessToken = token;
          this.errorMessage = null;
          return;
        }
      }

      const queryToken =
        this.route.snapshot.queryParamMap.get('access_token') ||
        this.route.snapshot.queryParamMap.get('token');
      if (queryToken) {
        this.accessToken = queryToken;
        this.errorMessage = null;
        return;
      }

      this.errorMessage = 'Invalid or expired reset link.';
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  checkPasswordRequirements(password: string): void {
    this.passwordRequirements.length =
      password.length >= 8 && password.length <= 64;
    this.passwordRequirements.uppercase = /[A-Z]/.test(password);
    this.passwordRequirements.lowercase = /[a-z]/.test(password);
    this.passwordRequirements.digit = /\d/.test(password);
    this.passwordRequirements.special = /[@$!%*?&#]/.test(password);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.accessToken) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formattedBaseUrl = this.baseUrl.endsWith('/')
      ? this.baseUrl
      : `${this.baseUrl}/`;
    const url = `${formattedBaseUrl}auth/v1/user`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      apikey: this.apiKey,
      'Content-Type': 'application/json',
    });

    const body = { password: this.resetForm.value.password };

    this.http.put(url, body, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          'Your password has been updated successfully. You can now log in';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.msg ||
          err.error?.message ||
          'An error occurred while updating your password.';
      },
    });
  }
}