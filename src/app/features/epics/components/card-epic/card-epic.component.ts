import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Epic } from '../../epics.model';

@Component({
  selector: 'app-card-epic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-epic.component.html'
})
export class CardEpicComponent {
  @Input({ required: true }) epic!: Epic;

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}