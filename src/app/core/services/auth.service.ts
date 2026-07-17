import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.supabaseUrl}auth/v1`; 
  private supabaseKey = environment.supabase_api_key; 
  private dbUrl = `${environment.supabaseUrl}rest/v1/projects`;

  constructor(private http: HttpClient, private router: Router) { }

  login(loginData: any): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });

    const body = {
      email: loginData.email,
      password: loginData.password
    };

    return this.http.post<any>(`${this.baseUrl}/token?grant_type=password`, body, { headers });
  }

  signUp(signUpData: any): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });

    const body = {
      email: signUpData.email,
      password: signUpData.password,
      data: {
        full_name: signUpData.name,    
        job_title: signUpData.jobTitle   
      }
    };

    return this.http.post<any>(`${this.baseUrl}/signup`, body, { headers });
  }

  getUserData(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.baseUrl}/user`, { headers });
  }

  saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  logOut(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/logout`, {}, { headers });
  }

  clearData(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}/recover`, { email }, { headers });
  }

  updatePassword(password: string, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.baseUrl}/user`, { password }, { headers });
  }
}