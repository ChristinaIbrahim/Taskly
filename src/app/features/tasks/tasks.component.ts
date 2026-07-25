import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardViewTaskComponent } from './components/board-view-task/board-view-task.component';
import { ListViewTaskComponent } from './components/list-view-task/list-view-task.component';
import { TaskDetailsPopupComponent } from './components/task-details-popup/task-details-popup.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule, 
    BoardViewTaskComponent, 
    ListViewTaskComponent,
    TaskDetailsPopupComponent 
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  projectId: string | number = '1'; 
  currentView: 'board' | 'list' = 'board';

  selectedTaskId: string | number | null = null;
  selectedProjectId: string | number | null = null;

  ngOnInit(): void {}

  onViewChange(event: any): void {
    this.currentView = event.target.value;
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