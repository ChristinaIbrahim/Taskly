import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive'; 
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { AuthContainerComponent } from '../../../shared/components/auth-container/auth-container.component'; 

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    AppIconsDirective, 
    FormFieldComponent, 
    AuthContainerComponent
  ],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    console.log('Email submitted:', this.forgotForm.value.email);
    
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}