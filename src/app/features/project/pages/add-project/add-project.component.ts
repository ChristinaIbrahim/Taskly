import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../project.service';
import { AppIconsDirective } from '../../../../shared/directives/app-icons.directive';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppIconsDirective
  ],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  get descriptionLength(): number {
    return this.projectForm?.get('description')?.value?.length || 0;
  }

  getErrorMessage(controlName: string): string {
    const control = this.projectForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['maxlength']) return `Cannot exceed ${control.errors['maxlength'].requiredLength} characters.`;
    
    return '';
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.projectService.createProject(this.projectForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Project created successfully!';
        this.projectForm.reset();
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to create project. Please try again.';
      }
    });
  }
}