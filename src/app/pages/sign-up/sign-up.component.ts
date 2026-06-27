import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.signUpForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[\p{L} ]+$/u),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        jobTitle: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: (control: AbstractControl) => {
          const password = control.get('password')?.value;
          const confirmPassword = control.get('confirmPassword')?.value;
          return password === confirmPassword
            ? null
            : { passwordMismatch: true };
        },
      },
    );
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log('البيانات صحيحة:', this.signUpForm.value);
    } else {
      console.log('الفورم فيه أخطاء');
    }
  }
}
