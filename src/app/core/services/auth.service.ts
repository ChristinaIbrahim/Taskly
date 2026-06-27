import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://ydfdgnmkmpobecxnkjbu.supabase.co/auth/v1/token?grant_type=password';
  
  private supabaseKey = 'sb_publishable_R2NQQmStwtA3XQpLlzihlw_BpSCLDIW'; 

  

  constructor(private http: HttpClient) { }

  login(loginData: any) {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      email: loginData.email,
      password: loginData.password
    };

    return this.http.post(this.apiUrl, body, { headers: headers });
  }

  getUserData() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get('https://ydfdgnmkmpobecxnkjbu.supabase.co/auth/v1/user', { headers: headers });
  }

  saveToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }
}
