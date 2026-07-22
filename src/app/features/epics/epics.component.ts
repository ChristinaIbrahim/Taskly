import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic, ProjectMember } from './epics.model';
import { CardEpicComponent } from './components/card-epic/card-epic.component';
import { EpicCardSkeletonComponent } from './components/epic-card-skeleton/epic-card-skeleton.component';
import { EmptyErrorComponent } from './components/empty-error/empty-error.component';
import { FormEpicComponent } from './components/form-epic/form-epic.component';

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [
    CommonModule,
    CardEpicComponent,
    EpicCardSkeletonComponent,
    EmptyErrorComponent,
    FormEpicComponent,
  ],
  templateUrl: './epics.component.html',
  styleUrls: ['./epics.component.css'],
})
export class EpicsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private epicsService = inject(EpicsService);

  epics: Epic[] = [];
  projectMembers: ProjectMember[] = [];
  isLoading = true;
  hasError = false;
  projectId = '';
  showForm = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.hasError = true;
        this.isLoading = false;
        return;
      }

      this.projectId = id;
      this.fetchEpics(this.projectId);
      this.fetchMembers(this.projectId);
    });
  }

  fetchEpics(projectId: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.epicsService.getProjectEpics(projectId).subscribe({
      next: (data) => {
        this.epics = data;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  fetchMembers(projectId: string): void {
    this.epicsService.getProjectMembers(projectId).subscribe({
      next: (data) => {
        this.projectMembers = data || [];
      },
      error: () => {
        this.projectMembers = [];
      },
    });
  }

  onEpicCreated(newEpic: Epic): void {
    this.epics = [newEpic, ...this.epics];
    this.showForm = false;
  }
}