import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EpicsService } from './epics.service';
import { Epic } from './epics.model';
import { CardEpicComponent } from './components/card-epic/card-epic.component';
import { SkeltonComponent } from '../project/components/skelton/skelton.component';

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [RouterLink, CardEpicComponent, SkeltonComponent],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css',
})
export class EpicsComponent implements OnInit {
  projectId: string | null = null;
  projectName = 'PROJECT NAME';
  epics: Epic[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private epicsService: EpicsService,
  ) {}

  ngOnInit(): void {
    this.projectId =
      this.route.snapshot.paramMap.get('id') ||
      this.route.parent?.snapshot.paramMap.get('id') ||
      null;

    if (this.projectId) {
      this.fetchEpics(this.projectId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Project ID not found in the URL.';
    }
  }

  fetchEpics(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.epicsService.getProjectEpics(id).subscribe({
      next: (data) => {
        this.epics = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching epics:', err);
        this.errorMessage = 'Failed to load project epics. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
