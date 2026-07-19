import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardProjectComponent } from '../../components/card-project/card-project.component';
import { ProjectService } from '../../project.service';
import { EmptyProjectsComponent } from '../../components/empty-projects/empty-projects.component';
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, CardProjectComponent, CommonModule , EmptyProjectsComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  currentPage: number = 1;
  limit: number = 3;
  totalCount: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  isLoading: boolean = false;
  isError: boolean = false;
  isMobile: boolean = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadProjects();
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  loadProjects(append: boolean = false): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.isError = false;

    const offset = (this.currentPage - 1) * this.limit;

    this.projectService.getProjects(this.limit, offset).subscribe({
      next: (response) => {
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
      error: (err) => {
        console.error(err);
        this.isError = true;
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
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
