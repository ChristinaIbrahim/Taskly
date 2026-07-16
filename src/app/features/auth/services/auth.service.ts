import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable , tap} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

private apiUrl = `${environment.supabaseUrl}auth/v1/token?grant_type=password`;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }, rememberMe: boolean): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': environment.supabase_api_key,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.handleSession(response.access_token, rememberMe);
        }
      })
    );
  }

  private handleSession(token: string, rememberMe: boolean) {
    localStorage.setItem('access_token', token);

    if (rememberMe) {
      const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
      const expireDate = new Date().getTime() + oneMonthInMs;
      localStorage.setItem('token_expiration', expireDate.toString());
    } else {
      localStorage.removeItem('token_expiration');
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    const expiration = localStorage.getItem('token_expiration');

    if (!token) return false;

    if (expiration) {
      const now = new Date().getTime();
      if (now > parseInt(expiration, 10)) {
        this.logout();
        return false;
      }
    }
    return true;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    this.router.navigate(['/login']);
  }
}

