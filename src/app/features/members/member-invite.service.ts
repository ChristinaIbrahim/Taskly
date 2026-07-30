import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MemberInviteService {

private http = inject(HttpClient);
private apiUrl = environment.supabaseUrl;

  inviteMember(email: string, projectId: string) {
    const url = `${this.apiUrl}/rest/v1/rpc/invite_member`;
    
    const headers = new HttpHeaders({
      'apikey': environment.supabase_api_key,
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });

    const body = {
      p_email: email,
      p_project_id: projectId,
      p_app_url: window.location.origin,
      p_base_url: this.apiUrl
    };

    return this.http.post(url, body, { headers });
  }}
