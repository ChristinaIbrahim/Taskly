import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardViewTaskComponent } from './components/board-view-task/board-view-task.component';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [BoardViewTaskComponent,CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit  {
private route = inject(ActivatedRoute);
  projectId: string = '';
  currentView: string = 'board';

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    
    this.route.queryParamMap.subscribe(params => {
      this.currentView = params.get('view') || 'board';
    });
  }
}
