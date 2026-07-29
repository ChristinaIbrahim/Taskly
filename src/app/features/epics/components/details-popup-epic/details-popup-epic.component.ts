import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EpicsService } from '../../epics.service';
import { Epic } from '../../epics.model';

@Component({
  selector: 'app-details-popup-epic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-popup-epic.component.html',
  styleUrls: ['./details-popup-epic.component.css'],
})
export class DetailsPopupEpicComponent implements OnInit {
  @Input() projectId!: string;
  @Input() epicId!: string;
  @Output() closed = new EventEmitter<void>();

  private epicsService = inject(EpicsService);
  private router = inject(Router);

  epic?: Epic;
  tasks: any[] = [];
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    if (this.projectId && this.epicId) {
      this.isLoading = true;
      this.hasError = false;
      this.epicsService.getProjectEpics(this.projectId).subscribe({
        next: (epics) => {
          this.epic = epics.find((e) => e.id === this.epicId);
          this.isLoading = false;
          if (!this.epic) {
            this.hasError = true;
          }
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        },
      });

      this.epicsService.getTasksByEpic(this.epicId).subscribe({
        next: (tasks) => {
          console.log('Tasks Data from api:', tasks); 
          this.tasks = tasks || [];
        },
        error: (err) => {
          console.error('Error fetching tasks:', err);
        },
      });

    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  onAddTask(): void {
    if (this.projectId && this.epicId) {
      this.router.navigate(['/project', this.projectId, 'tasks', 'new'], {
        queryParams: { epic_id: this.epicId },
      });
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.onClose();
    }
  }
}