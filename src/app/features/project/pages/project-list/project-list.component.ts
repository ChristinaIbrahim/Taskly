import { Component, OnInit, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardProjectComponent } from '../../components/card-project/card-project.component';
import { ProjectService } from '../../project.service';
import { EmptyProjectsComponent } from '../../components/empty-projects/empty-projects.component';

export interface Project {
  id?: string | number;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ProjectsResponse {
  body: Project[] | null;
  headers: {
    get(name: string): string | null;
  };
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CardProjectComponent, EmptyProjectsComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects: Project[] = [];
  currentPage = 1;
  limit = 3;
  totalCount = 0;
  totalPages = 0;
  pagesArray: number[] = [];
  isLoading = false;
  isError = false;
  isMobile = false;

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadProjects();
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  loadProjects(append = false): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.isError = false;

    const offset = (this.currentPage - 1) * this.limit;

    this.projectService.getProjects(this.limit, offset).subscribe({
      next: (res: unknown) => {
        const response = res as ProjectsResponse;
        const data = response.body || [];

        if (append) {
          this.projects = [...this.projects, ...data];
        } else {
          this.projects = data;
        }

        const contentRange = response.headers.get('Content-Range');
        if (contentRange && contentRange.includes('/')) {
          const parts = contentRange.split('/');
          this.totalCount = parseInt(parts[1], 10);
          this.totalPages = Math.ceil(this.totalCount / this.limit);
          this.pagesArray = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1,
          );
        } else {
          this.totalPages = 1;
          this.pagesArray = [1];
        }

        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error(err);
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isMobile || this.isLoading || this.currentPage >= this.totalPages)
      return;

    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      window.innerHeight;
    const max = document.documentElement.scrollHeight;

    if (pos >= max - 50) {
      this.currentPage++;
      this.loadProjects(true);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProjects(false);
    }
  }
}
