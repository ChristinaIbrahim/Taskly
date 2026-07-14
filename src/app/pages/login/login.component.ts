import { Component } from '@angular/core';
import { ReactiveFormsModule , FormBuilder , FormGroup, Validators } from '@angular/forms';
import { Router , RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
   loginForm! : FormGroup;

   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
     this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required]],
       rememberMe: false
     });
   }

   onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      const rememberMe = this.loginForm.value.rememberMe || false;
      
      this.authService.login(loginData).subscribe({
        next: (response: any) => { 
          this.authService.saveToken(response.access_token, rememberMe);
          this.router.navigate(['/project']);
        },
        error: (err) => {
          alert('Email Or Password IS INCorrect');
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
    }
   }
   

}
