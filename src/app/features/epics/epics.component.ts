import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EpicsService } from './epics.service';
import { Epic, ProjectMember } from './epics.model';
import { CardEpicComponent } from './components/card-epic/card-epic.component';
import { EpicCardSkeletonComponent } from './components/epic-card-skeleton/epic-card-skeleton.component';
import { EmptyErrorComponent } from './components/empty-error/empty-error.component';
import { FormEpicComponent } from './components/form-epic/form-epic.component';
import { DetailsPopupEpicComponent } from './components/details-popup-epic/details-popup-epic.component';

@Component({
  selector: 'app-epics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardEpicComponent,
    EpicCardSkeletonComponent,
    EmptyErrorComponent,
    FormEpicComponent,
    DetailsPopupEpicComponent,
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
  searchTerm = '';
  selectedEpicId: string | null = null;
  pageSize = 6;
  currentPage = 1;

  get filteredEpics(): Epic[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.epics;
    return this.epics.filter((epic) =>
      epic.title?.toLowerCase().includes(term),
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEpics.length / this.pageSize));
  }

  get paginatedEpics(): Epic[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEpics.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

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
        this.epics = data || [];
        this.currentPage = 1;
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

  onEpicCreated(): void {
    this.showForm = false;
    this.fetchEpics(this.projectId);
  }

  openEpicDetails(epicId: string): void {
    this.selectedEpicId = epicId;
  }

  closeEpicDetails(): void {
    this.selectedEpicId = null;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }
}
