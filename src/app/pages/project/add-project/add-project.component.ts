import { Component, OnInit } from '@angular/core'; // 👈 زودنا OnInit هنا
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit { // 👈 زودنا implements OnInit هنا
  projectForm!: FormGroup;
  isLoading = false; 

  // 👈 هنا السحر! زودنا private authService: AuthService جوه الـ constructor
  constructor(private fb: FormBuilder, private authService: AuthService) {}

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

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.createProject(this.projectForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Project created successfully');
        this.projectForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert(`Failed to create project: ${err.message || 'Error'}`);
      }
    });
  }
}