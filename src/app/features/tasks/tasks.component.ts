import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardViewTaskComponent } from './components/board-view-task/board-view-task.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [BoardViewTaskComponent, CommonModule , RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  projectId = '';
  currentView = 'board';

  ngOnInit(): void {
    let route: ActivatedRoute | null = this.route;
    while (route) {
      const id = route.snapshot.paramMap.get('id');
      if (id) {
        this.projectId = id;
        break;
      }
      route = route.parent;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.currentView = params.get('view') || 'board';
    });
  }
}