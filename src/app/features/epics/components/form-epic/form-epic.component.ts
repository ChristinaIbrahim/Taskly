import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Epic, ProjectMember } from '../../epics.model';
import { EpicsService } from '../../epics.service';

@Component({
  selector: 'app-form-epic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-epic.component.html',
})
export class FormEpicComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly epicsService = inject(EpicsService);

  @Input({ required: true }) projectId!: string;

  private _projectMembers: ProjectMember[] = [];
  @Input() set projectMembers(value: ProjectMember[] | null | undefined) {
    this._projectMembers = value ?? [];
  }
  get projectMembers(): ProjectMember[] {
    return this._projectMembers;
  }

  @Output() created = new EventEmitter<Epic>();
  @Output() cancelled = new EventEmitter<void>();

  epicForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.epicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      assignee_id: [''],
      deadline: ['', [this.minDateValidator(today)]],
    });
  }

  private minDateValidator(minDate: string) {
    return (control: { value: string }) => {
      if (!control.value) return null;
      return control.value >= minDate ? null : { pastDate: true };
    };
  }

  onCancel(): void {
    this.epicForm.reset();
    this.cancelled.emit();
  }

  onSubmit(): void {
    if (this.epicForm.invalid) {
      this.epicForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.epicForm.value;

    const payload: Partial<Epic> = {
      title: formValue.title,
      description: formValue.description || null,
      assignee_id: formValue.assignee_id || null,
      deadline: formValue.deadline || null,
      project_id: this.projectId,
    } as Partial<Epic>;

    this.epicsService.createEpic(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.created.emit(response as unknown as Epic);
        this.epicForm.reset();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create epic. Please try again.';
      },
    });
  }
}