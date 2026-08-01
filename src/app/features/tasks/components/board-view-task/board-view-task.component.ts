import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
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
  imports: [CommonModule, DragDropModule], 
  templateUrl: './board-view-task.component.html',
  styleUrl: './board-view-task.component.css',
})
export class BoardViewTaskComponent implements OnInit, OnChanges {
  @Input() projectId = '';
  @Output() taskClick = new EventEmitter<string | number>();
  @Input() searchTerm = '';

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService); 

  apiUrl = environment.supabaseUrl;
  apiKey = environment.supabase_api_key;

 columns: BoardColumn[] = [
    { key: 'TO_DO', label: 'TO DO', tasks: [], count: 0 },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS', tasks: [], count: 0 },
    { key: 'BLOCKED', label: 'BLOCKED', tasks: [], count: 0 },
    { key: 'IN_REVIEW', label: 'IN REVIEW', tasks: [], count: 0 },
    { key: 'READY_FOR_QA', label: 'READY FOR QA', tasks: [], count: 0 },
    { key: 'REOPENED', label: 'REOPENED', tasks: [], count: 0 },
    { key: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION', tasks: [], count: 0 },
    { key: 'DONE', label: 'DONE', tasks: [], count: 0 },
  ];

  ngOnInit(): void {
    if (this.projectId) {
      this.loadAllColumnsTasks();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
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
    let url = `${this.apiUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}&status=eq.${column.key}`;
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      url += `&title=ilike.%25${this.searchTerm.trim()}%25`;
    }

    this.http.get<Task[]>(url, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        column.tasks = data;
        column.count = data.length;
      },
      error: (err: unknown) => {
        console.error(`Failed to load tasks for ${column.key}`, err);
        this.toastService.show('Failed to search tasks');         },
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

  onDrop(event: CdkDragDrop<Task[]>, targetColumnKey: string): void {
    const task = event.item.data as Task;
    if (event.previousContainer === event.container) {
      return moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    const oldStatus = task.status;
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    task.status = targetColumnKey;
    this.updateColumnCounts();
    
    const headers = this.getHeaders()
      .set('Content-Type', 'application/json')
      .set('Prefer', 'return=minimal');

    this.http.patch(
      `${this.apiUrl}rest/v1/tasks?id=eq.${task.id}`, 
      { status: targetColumnKey }, 
      { headers }
    ).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Detailed Supabase Error:', err);
        transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
        task.status = oldStatus;
        this.updateColumnCounts();
        this.toastService.show('failed update task');
      }
    });
  }

  getConnectedListIds(): string[] {
    return this.columns.map((_, i) => `cdk-drop-list-${i}`);
  }

  hasNoTasks(): boolean {
    return this.columns.every(col => col.tasks.length === 0);
  }
}