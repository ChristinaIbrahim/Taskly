import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-task-details-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details-popup.component.html',
  styleUrls: ['./task-details-popup.component.css'],
})
export class TaskDetailsPopupComponent implements OnInit {
  @Input() taskId!: string | number;
  @Input() projectId!: string | number;
  @Output() close = new EventEmitter<void>();

  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  private apiUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  task: any = null;
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    if (this.taskId && this.projectId) {
      this.fetchTaskDetails();
    } else {
      this.isLoading = false;
      this.hasError = true;
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.authService.getToken() || ''}`,
      'Content-Type': 'application/json',
    });
  }

  fetchTaskDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl : `${this.apiUrl}/`;
    const url = `${baseUrl}rest/v1/project_tasks?project_id=eq.${this.projectId}&id=eq.${this.taskId}`;

    this.http.get<any[]>(url, { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.task = response[0];
        } else {
          this.hasError = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching task details:', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.onClose();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'DONE':
        return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'BLOCKED':
        return 'bg-red-100 text-red-700';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-700';
      case 'READY_FOR_QA':
        return 'bg-yellow-100 text-yellow-700';
      case 'REOPENED':
        return 'bg-orange-100 text-orange-700';
      case 'READY_FOR_PRODUCTION':
        return 'bg-teal-100 text-teal-700';
      case 'TO_DO':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  formatStatus(status: string): string {
    if (!status) return 'To Do';
    return status.replace(/_/g, ' ');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.toastService.show('Link copied to clipboard!');
  }
}
