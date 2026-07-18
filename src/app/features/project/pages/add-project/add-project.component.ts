import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../project.service';
@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
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
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]]
    });
  }

  get descriptionLength(): number {
    return this.projectForm.get('description')?.value?.length || 0;
  }

  getErrorMessage(controlName: string): string {
    const control = this.projectForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) return `Project name must be at least ${control.errors['minlength'].requiredLength} characters.`;
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

    const projectData = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description
    };

    this.projectService.createProject(projectData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Project created successfully.';
        this.projectForm.reset();
        
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = `Failed to create project: ${err.error?.message || err.message}`;
        }
      }
    });
  }

}
