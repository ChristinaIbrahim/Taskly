import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { Task, BoardColumn } from '../../task.model';
import { 
  DragDropModule, 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem 
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-view-task',
  standalone: true,
  imports: [CommonModule,DragDropModule],
  templateUrl: './board-view-task.component.html',
  styleUrl: './board-view-task.component.css',
})
export class BoardViewTaskComponent implements OnInit {
  @Input() projectId = '';
  @Output() taskClick = new EventEmitter<string | number>();

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

  onTaskClick(taskId: string | number | undefined): void {
    if (taskId) {
      this.taskClick.emit(taskId);
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.due_date || task.status === 'DONE') return false;
    const due = new Date(task.due_date);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  }

  isToday(task: Task): boolean {
    if (!task.due_date) return false;
    const due = new Date(task.due_date);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  private updateColumnCounts(): void {
  this.columns.forEach((col) => {
    col.count = col.tasks.length; 
  });
}
}
