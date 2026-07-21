import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private getCleanBaseUrl(): string {
    const url = environment.supabaseUrl.endsWith('/')
      ? environment.supabaseUrl
      : `${environment.supabaseUrl}/`;
    return `${url}auth/v1`;
  }

  private supabaseKey = environment.supabase_api_key;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(loginData: any): Observable<any> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(
      `${this.getCleanBaseUrl()}/token?grant_type=password`,
      { email: loginData.email, password: loginData.password },
      { headers },
    );
  }

  signUp(signUpData: any): Observable<any> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      'Content-Type': 'application/json',
    });
    const body = {
      email: signUpData.email,
      password: signUpData.password,
      data: { full_name: signUpData.name, job_title: signUpData.jobTitle },
    };
    return this.http.post<any>(`${this.getCleanBaseUrl()}/signup`, body, {
      headers,
    });
  }

  getUserData(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .get<any>(`${this.getCleanBaseUrl()}/user`, { headers })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logOut(): Observable<any> {
    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.post<any>(
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
