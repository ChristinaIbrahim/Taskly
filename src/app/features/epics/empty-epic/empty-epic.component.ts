import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppIconsDirective } from '../../../shared/directives/app-icons.directive';

@Component({
  selector: 'app-empty-epic',
  standalone: true,
  imports: [CommonModule, AppIconsDirective],
  templateUrl: './empty-epic.component.html',
  styleUrls: ['./empty-epic.component.css']
})
export class EmptyEpicComponent {
  @Output() createEpic = new EventEmitter<void>();

  onCreateClick(): void {
    this.createEpic.emit();
  }
}