import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Epic, ProjectMember } from './epics.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EpicsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private baseUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  private getCleanUrl(endpoint: string): string {
    const url = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    return `${url}${endpoint}`;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.authService.getToken() || ''}`,
      'Content-Type': 'application/json',
    });
  }

  getProjectEpics(projectId: string): Observable<Epic[]> {
    return this.http.get<Epic[]>(
      `${this.getCleanUrl('rest/v1/project_epics')}?project_id=eq.${projectId}&select=*`,
      { headers: this.getHeaders() },
    );
  }

  getProjectMembers(projectId: string): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(
      `${this.getCleanUrl('rest/v1/project_members')}?project_id=eq.${projectId}&select=*`,
      { headers: this.getHeaders() },
    );
  }

  createEpic(epicData: Partial<Epic>): Observable<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(
      this.getCleanUrl('rest/v1/project_epics'),
      epicData,
      { headers: this.getHeaders() },
    );
  }
}