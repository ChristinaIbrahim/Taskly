import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProjectService } from '../project/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly projectService = inject(ProjectService);

  projectForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(500)]],
  });

  projectId = '';
  projectTitleForBreadcrumb = 'Loading...';
  isLoading = false;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.projectId) {
      this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    }

    if (this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (res: Record<string, unknown>[]) => {
          const project = res[0];
          if (project) {
            this.projectTitleForBreadcrumb = String(project['name'] || '');
            this.projectForm.patchValue({
              name: project['name'],
              description: project['description'] || '',
            });

            this.projectForm.get('name')?.valueChanges.subscribe((value) => {
              if (this.projectForm.get('name')?.valid) {
                this.projectTitleForBreadcrumb = value;
              }
            });
          }
        },
        error: (err) => {
          console.error('Error fetching project:', err);
          this.projectTitleForBreadcrumb = 'Error Loading Project';
        },
      });
    } else {
      console.error('Could not find Project ID in the URL params.');
      this.projectTitleForBreadcrumb = 'Invalid Route';
    }
  }

  onSave(): void {
    if (this.projectForm.invalid || this.isLoading || !this.projectId) return;

    this.isLoading = true;
    const updatedData = this.projectForm.value;

    this.projectService.updateProject(this.projectId, updatedData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/project']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to update project.');
        console.error(err);
      },
    });
  }
}
