import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.css']
})
export class AddNewTaskComponent implements OnInit {
  taskForm!: FormGroup;
  projectId: string = '';
  epics: any[] = [];
  members: any[] = [];
  isLoading: boolean = false;

  statuses = [
    { key: 'TO_DO', label: 'TO DO' },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS' },
    { key: 'BLOCKED', label: 'BLOCKED' },
    { key: 'IN_REVIEW', label: 'IN REVIEW' },
    { key: 'READY_FOR_QA', label: 'READY FOR QA' },
    { key: 'REOPENED', label: 'REOPENED' },
    { key: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION' },
    { key: 'DONE', label: 'DONE' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    const prefilledEpicId = this.route.snapshot.queryParamMap.get('epic_id');

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      status: ['TO_DO', Validators.required],
      epic_id: [prefilledEpicId || ''],
      assignee_id: [''],
      due_date: [''],
      description: ['']
    });

    this.loadProjectData();
  }

  loadProjectData(): void {
  }

  formatEpicLabel(epic: any): string {
    const title = epic.title.length > 100 ? epic.title.substring(0, 100) + '...' : epic.title;
    return `${epic.epic_id} ${title}`;
  }

  onBack(): void {
    this.router.navigate(['/project', this.projectId, 'tasks']);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValues = this.taskForm.value;
    const payload = {
      project_id: this.projectId,
      title: formValues.title,
      status: formValues.status,
      epic_id: formValues.epic_id || null,
      assignee_id: formValues.assignee_id || null,
      due_date: formValues.due_date ? new Date(formValues.due_date).toISOString() : null,
      description: formValues.description || null
    };

    console.log('Creating task payload:', payload);
  }
}