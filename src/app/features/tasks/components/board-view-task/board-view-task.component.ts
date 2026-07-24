import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-board-view-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-view-task.component.html',
  styleUrl: './board-view-task.component.css'
})
export class BoardViewTaskComponent  implements OnInit{

 @Input() projectId: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  apiUrl = environment.supabaseUrl;
  apiKey = environment.supabase_api_key;

  columns: Array<{ key: string; label: string; tasks: any[]; count: number }> = [
    { key: 'TO_DO', label: 'TO DO', tasks: [], count: 0 },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS', tasks: [], count: 0 },
    { key: 'BLOCKED', label: 'BLOCKED', tasks: [], count: 0 },
    { key: 'IN_REVIEW', label: 'IN REVIEW', tasks: [], count: 0 },
    { key: 'READY_FOR_QA', label: 'READY FOR QA', tasks: [], count: 0 },
    { key: 'REOPENED', label: 'REOPENED', tasks: [], count: 0 },
    { key: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION', tasks: [], count: 0 },
    { key: 'DONE', label: 'DONE', tasks: [], count: 0 }
  ];

  ngOnInit(): void {
    if (this.projectId) {
      this.loadAllColumnsTasks();
    }
  }

  loadAllColumnsTasks(): void {
    this.columns.forEach(column => {
      this.fetchTasksForColumn(column);
    });
  }

  fetchTasksForColumn(column: any): void {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    });

    this.http.get<any[]>(`${this.apiUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}&status=eq.${column.key}`, { headers }).subscribe({
      next: (data) => {
        column.tasks = data;
        column.count = data.length;
      },
      error: (err) => {
        console.error(`Failed to load tasks for ${column.key}`, err);
      }
    });
  }

  onAddTask(statusKey: string): void {
    this.router.navigate(['/project', this.projectId, 'tasks', 'new'], {
      queryParams: { status: statusKey }
    });
  }

}
