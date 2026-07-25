import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardViewTaskComponent } from './components/board-view-task/board-view-task.component';
import { ListViewTaskComponent } from './components/list-view-task/list-view-task.component'; 
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [BoardViewTaskComponent, ListViewTaskComponent, CommonModule, RouterLink], 
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
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
  onViewChange(event: any): void {
    const selectedView = event.target.value;
    this.currentView = selectedView;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: selectedView },
      queryParamsHandling: 'merge'
    });
  }
}