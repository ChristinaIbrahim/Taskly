import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-error.component.html'
})
export class EmptyErrorComponent {
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}