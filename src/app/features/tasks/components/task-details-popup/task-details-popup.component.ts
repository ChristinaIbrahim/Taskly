import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-task-details-popup',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './task-details-popup.component.html',
  styleUrls: ['./task-details-popup.component.css']
})
export class TaskDetailsPopupComponent implements OnInit {
  @Input() taskId!: string | number;
  @Input() projectId!: string | number;
  @Output() close = new EventEmitter<void>();
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
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

  fetchTaskDetails(): void {
    this.isLoading = true;
    this.hasError = false;

    const url = `/rest/v1/project_tasks?project_id=eq.${this.projectId}&id=eq.${this.taskId}`;
    
    this.http.get<any[]>(url).subscribe({
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
      }
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
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    this.toastService.show('Link copied to clipboard!');
  }
}