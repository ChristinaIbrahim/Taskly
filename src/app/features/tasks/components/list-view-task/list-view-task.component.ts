import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Task {
  id?: string | number;
  title?: string;
  status?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-list-view-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-view-task.component.html',
  styleUrls: ['./list-view-task.component.css'],
})
export class ListViewTaskComponent implements OnInit {
  @Input() projectId = '';

  tasks: Task[] = [];
  isLoading = false;

  private http = inject(HttpClient);
  private apiUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  ngOnInit(): void {
    if (this.projectId) {
      this.loadTasks();
    }
  }

  loadTasks(): void {
    this.isLoading = true;
    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    this.http
      .get<
        Task[]
      >(`${this.apiUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}`, { headers })
      .subscribe({
        next: (data) => {
          this.tasks = data;
          this.isLoading = false;
        },
        error: (err: unknown) => {
          console.error('Failed to load tasks', err);
          this.isLoading = false;
        },
      });
  }
}
