import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AppIconsDirective,
    FormFieldComponent,
    AuthContainerComponent,
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  forgotForm!: FormGroup;
  isLoading = false;
  isSubmittedSuccessfully = false;
  timeLeft = 300;
  timerDisplay = '05:00';
  resendTrials = 3;
  timerSubscription!: Subscription;

  private baseUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.sendRecoveryEmail();
  }

  sendRecoveryEmail(): void {
    this.isLoading = true;

    const url = `${this.baseUrl}auth/v1/recover`;

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      'Content-Type': 'application/json',
    });

    const body = { email: this.forgotForm.value.email };

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: (error) => {
        console.error('API Error:', error);
        this.handleSuccess();
      },
    });
  }

  handleSuccess(): void {
    this.isLoading = false;
    this.isSubmittedSuccessfully = true;
    this.startResendTimer();
  }

  startResendTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timeLeft = 300;
    this.updateTimerDisplay();

    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe({
        next: () => {
          this.timeLeft--;
          this.updateTimerDisplay();
        },
      });
  }

  updateTimerDisplay(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onResend(): void {
    if (this.resendTrials > 0 && this.timeLeft === 0) {
      this.resendTrials--;
      this.sendRecoveryEmail();
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
