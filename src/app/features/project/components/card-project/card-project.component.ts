import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-project',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './card-project.component.html',
  styleUrl: './card-project.component.css',
})
export class CardProjectComponent {
  @Input() project: any;
}
