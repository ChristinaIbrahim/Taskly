import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthCredentials {
  email?: string;
  password?: string;
  name?: string;
  jobTitle?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();

  private supabaseKey = environment.supabase_api_key;

  private getCleanBaseUrl(): string {
    const url = environment.supabaseUrl.endsWith('/')
      ? environment.supabaseUrl
      : `${environment.supabaseUrl}/`;
    return `${url}auth/v1`;
  }

  login(loginData: AuthCredentials): Observable<unknown> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      'Content-Type': 'application/json',
    });
    return this.http.post<unknown>(
      `${this.getCleanBaseUrl()}/token?grant_type=password`,
      { email: loginData.email, password: loginData.password },
      { headers },
    );
  }

  signUp(signUpData: AuthCredentials): Observable<unknown> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      'Content-Type': 'application/json',
    });
    const body = {
      email: signUpData.email,
      password: signUpData.password,
      data: { full_name: signUpData.name, job_title: signUpData.jobTitle },
    };
    return this.http.post<unknown>(`${this.getCleanBaseUrl()}/signup`, body, {
      headers,
    });
  }

  getUserData(): Observable<UserProfile> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .get<UserProfile>(`${this.getCleanBaseUrl()}/user`, { headers })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logOut(): Observable<unknown> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.getToken() ?? ''}`,
    });
    return this.http.post<unknown>(
      `${this.getCleanBaseUrl()}/logout`,
      {},
      { headers },
    );
  }

  clearData(): void {
    localStorage.removeItem('token');
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
