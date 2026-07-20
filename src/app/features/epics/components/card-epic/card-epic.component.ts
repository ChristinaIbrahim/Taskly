import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Epic } from '../../epics.model';

@Component({
  selector: 'app-card-epic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-epic.component.html',
  styleUrl: './card-epic.component.css'
})
export class CardEpicComponent {
  @Input({ required: true }) epic!: Epic;

  getInitials(name?: string): string {
    if (!name) return '??';
    const cleanName = name.includes('@') ? name.split('@')[0] : name;
    const parts = cleanName.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0] ? parts[0][0].toUpperCase() : '??';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'No Deadline';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}