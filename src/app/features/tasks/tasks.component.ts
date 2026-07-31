import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardViewTaskComponent } from './components/board-view-task/board-view-task.component';
import { ListViewTaskComponent } from './components/list-view-task/list-view-task.component';
import { TaskDetailsPopupComponent } from './components/task-details-popup/task-details-popup.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    BoardViewTaskComponent,
    ListViewTaskComponent,
    TaskDetailsPopupComponent,
    RouterLink,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  private route = inject(ActivatedRoute);

  projectId = '';
  currentView: 'board' | 'list' = 'board';

  selectedTaskId: string | number | null = null;
  selectedProjectId: string | number | null = null;

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
      const view = params.get('view');
      this.currentView = view === 'list' ? 'list' : 'board';
    });
  }

  onViewChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentView = value === 'list' ? 'list' : 'board';
  }

  openTaskDetails(taskId: string | number): void {
    this.selectedTaskId = taskId;
    this.selectedProjectId = this.projectId;
  }

  closeTaskDetails(): void {
    this.selectedTaskId = null;
    this.selectedProjectId = null;
  }
}
