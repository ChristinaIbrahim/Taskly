import { Component , OnInit , OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder , FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit { 
  forgotForm! : FormGroup;
  isLoading = false;       
  showSuccessMsg = false;  
  trialsLeft = 3;
  displayTime = '05:00';    
  isResendDisabled = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService 
  ) {}

  ngOnInit() : void {
    this.forgotForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccessMsg = true; 
      },
      error: (err) => {
        this.isLoading = false;
        alert('Email error ');
        console.error(err);
      }
    });
  }

}