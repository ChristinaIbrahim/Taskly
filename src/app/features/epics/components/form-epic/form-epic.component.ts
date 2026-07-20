import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EpicsService } from '../../epics.service';
import { ProjectMember } from '../../epics.model';

@Component({
  selector: 'app-form-epic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-epic.component.html',
  styleUrl: './form-epic.component.css'
})
export class FormEpicComponent implements OnInit {
  projectId: string | null = null;
  epicForm!: FormGroup;
  members: ProjectMember[] = [];
  isLoadingMembers = true;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private epicsService: EpicsService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || 
                     this.route.parent?.snapshot.paramMap.get('id') || 
                     null;

    this.initForm();

    if (this.projectId) {
      this.fetchMembers(this.projectId);
    } else {
      this.errorMessage = 'Project ID not found in the URL.';
    }
  }

  private initForm(): void {
    this.epicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      assignee_id: [''],
      deadline: ['', [this.futureDateValidator]]
    });
  }

  private fetchMembers(id: string): void {
    this.isLoadingMembers = true;
    this.epicsService.getProjectMembers(id).subscribe({
      next: (data) => {
        this.members = data;
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('Error fetching members:', err);
        this.isLoadingMembers = false;
      }
    });
  }

  private futureDateValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  onSubmit(): void {
    if (this.epicForm.invalid || !this.projectId) {
      this.epicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValues = this.epicForm.value;
    const epicPayload = {
      title: formValues.title,
      description: formValues.description || null,
      assignee_id: formValues.assignee_id || null,
      deadline: formValues.deadline || null,
      project_id: this.projectId
    };

    this.epicsService.createEpic(epicPayload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/project', this.projectId, 'epics']);
      },
      error: (err) => {
        console.error('Error creating epic:', err);
        this.errorMessage = 'Failed to create epic. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}