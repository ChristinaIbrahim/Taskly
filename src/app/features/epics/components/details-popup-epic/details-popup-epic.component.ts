import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpicsService } from '../../epics.service';
import { Epic } from '../../epics.model';

@Component({
  selector: 'app-details-popup-epic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-popup-epic.component.html',
  styleUrls: ['./details-popup-epic.component.css']
})
export class DetailsPopupEpicComponent implements OnInit {
  @Input() projectId!: string;
  @Input() epicId!: string;
  @Output() closed = new EventEmitter<void>();

  private epicsService = inject(EpicsService);
  
  epic?: Epic;
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    if (this.projectId && this.epicId) {
      this.isLoading = true;
      this.hasError = false;
      this.epicsService.getProjectEpics(this.projectId).subscribe({
        next: (epics) => {
          this.epic = epics.find(e => e.id === this.epicId);
          this.isLoading = false;
          if (!this.epic) {
            this.hasError = true;
          }
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        }
      });
    } else {
      this.hasError = true;
      this.isLoading = false;
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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