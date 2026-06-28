import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://ydfdgnmkmpobecxnkjbu.supabase.co/auth/v1';
  private supabaseKey = 'sb_publishable_R2NQQmStwtA3XQpLlzihlw_BpSCLDIW'; 

  constructor(private http: HttpClient) { }

  // 1. فانكشن تسجيل الدخول
  login(loginData: any) {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });

    const body = {
      email: loginData.email,
      password: loginData.password
    };

    return this.http.post(`${this.baseUrl}/token?grant_type=password`, body, { headers: headers });
  }

  signUp(signUpData: any) {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });

   const body = JSON.stringify({
      email: signUpData.email,
      password: signUpData.password,
      data: {
        full_name: signUpData.name 
      }
    });

    return this.http.post(`${this.baseUrl}/signup`, body, { headers: headers });
  }

  getUserData() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.baseUrl}/user`, { headers: headers });
  }

  saveToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }
}