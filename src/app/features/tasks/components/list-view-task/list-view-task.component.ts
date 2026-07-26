import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Task } from '../../task.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-list-view-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-view-task.component.html',
  styleUrls: ['./list-view-task.component.css'],
})
export class ListViewTaskComponent implements OnInit {
  @Input() projectId = '';
  @Output() taskClick = new EventEmitter<string | number>();

  tasks: Task[] = [];
  isLoading = false;

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  ngOnInit(): void {
    if (this.projectId) {
      this.loadTasks();
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.authService.getToken() || this.apiKey}`,
      'Content-Type': 'application/json',
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.http
      .get<Task[]>(
        `${this.apiUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}`,
        {
          headers: this.getHeaders(),
        },
      )
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

  onTaskClick(taskId: string | number | undefined): void {
    if (taskId) {
      this.taskClick.emit(taskId);
    }
  }
}
