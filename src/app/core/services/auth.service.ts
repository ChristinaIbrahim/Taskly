import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://ydfdgnmkmpobecxnkjbu.supabase.co/auth/v1';
  private supabaseKey = 'sb_publishable_R2NQQmStwtA3XQpLlzihlw_BpSCLDIW';
  private dbUrl = 'https://ydfdgnmkmpobecxnkjbu.supabase.co/rest/v1/projects';

  constructor(private http: HttpClient) { }

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
  logOut() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers: headers });
  }
  clearData() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    localStorage.clear();
    sessionStorage.clear();
    // document.cookie.split(";").forEach((c) => {
    //   document.cookie = c
    //     .replace(/^ +/, "")
    //     .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    // });
  }
  forgotPassword(email: string) {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    });

    const body = { email: email };

    return this.http.post(`${this.baseUrl}/recover`, body, { headers: headers });
  }
  createProject(projectData: { name: string; description: string }) {
    // بنجيب التوكن اللي إنتي مخزناه بالظبط باسم 'token'
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || ''; 

    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' 
    });

    return this.http.post(this.dbUrl, projectData, { headers: headers });
  }
}