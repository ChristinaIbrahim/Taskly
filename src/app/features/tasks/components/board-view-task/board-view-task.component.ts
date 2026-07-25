import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

interface Task {
  id?: string | number;
  title?: string;
  status?: string;
  [key: string]: unknown;
}

interface BoardColumn {
  key: string;
  label: string;
  tasks: Task[];
  count: number;
}

@Component({
  selector: 'app-board-view-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-view-task.component.html',
  styleUrl: './board-view-task.component.css',
})
export class BoardViewTaskComponent implements OnInit {
  @Input() projectId = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  apiUrl = environment.supabaseUrl;
  apiKey = environment.supabase_api_key;

  columns: BoardColumn[] = [
    { key: 'TO_DO', label: 'TO DO', tasks: [], count: 0 },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS', tasks: [], count: 0 },
    { key: 'BLOCKED', label: 'BLOCKED', tasks: [], count: 0 },
    { key: 'IN_REVIEW', label: 'IN REVIEW', tasks: [], count: 0 },
  ];

  ngOnInit(): void {
    if (this.projectId) {
      this.loadAllColumnsTasks();
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.authService.getToken() || ''}`,
    });
  }

  loadAllColumnsTasks(): void {
    this.columns.forEach((column) => {
      this.fetchTasksForColumn(column);
    });
  }

  fetchTasksForColumn(column: BoardColumn): void {
    this.http
      .get<
        Task[]
      >(`${this.apiUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}&status=eq.${column.key}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          column.tasks = data;
          column.count = data.length;
        },
        error: (err: unknown) => {
          console.error(`Failed to load tasks for ${column.key}`, err);
        },
      });
  }

  onAddTask(statusKey: string): void {
    this.router.navigate(['/project', this.projectId, 'tasks', 'new'], {
      queryParams: { status: statusKey },
    });
  }
}
