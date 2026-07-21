import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ProjectMember } from './project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private baseUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  private getCleanUrl(endpoint: string): string {
    const url = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
    return `${url}${endpoint}`;
  }

  getProjects(
    limit: number,
    offset: number,
  ): Observable<HttpResponse<Record<string, unknown>[]>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    });

    return this.http.get<Record<string, unknown>[]>(
      `${this.getCleanUrl('rest/v1/rpc/get_projects')}?limit=${limit}&offset=${offset}`,
      {
        headers,
        observe: 'response',
      },
    );
  }

  createProject(projectData: {
    name: string;
    description: string;
  }): Observable<Record<string, unknown>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    });

    return this.http.post<Record<string, unknown>>(
      this.getCleanUrl('rest/v1/projects'),
      projectData,
      { headers },
    );
  }

  getProjectById(id: string): Observable<Record<string, unknown>[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<Record<string, unknown>[]>(
      `${this.getCleanUrl('rest/v1/projects')}?id=eq.${id}`,
      { headers },
    );
  }

  updateProject(
    id: string,
    projectData: { name: string; description: string },
  ): Observable<Record<string, unknown>> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    });

    return this.http.patch<Record<string, unknown>>(
      `${this.getCleanUrl('rest/v1/projects')}?id=eq.${id}`,
      projectData,
      { headers },
    );
  }

  getProjectMembers(projectId: string): Observable<ProjectMember[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<ProjectMember[]>(
      `${this.getCleanUrl('rest/v1/get_project_members')}?project_id=eq.${projectId}`,
      { headers },
    );
  }
}
