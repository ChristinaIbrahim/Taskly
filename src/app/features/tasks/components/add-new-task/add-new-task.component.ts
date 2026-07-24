import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.css']
})
export class AddNewTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  taskForm!: FormGroup;
  projectId: string = '';
  epics: any[] = [];
  members: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

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

  private apiUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

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

    this.loadProjectEpics();
    this.loadProjectMembers();
  }

  loadProjectEpics(): void {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    });

    this.http.get<any[]>(`${this.apiUrl}rest/v1/epics?project_id=eq.${this.projectId}`, { headers }).subscribe({
      next: (data) => {
        this.epics = data;
      },
      error: (err) => {
        console.error('Failed to load epics', err);
      }
    });
  }

  loadProjectMembers(): void {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    });

    this.http.get<any[]>(`${this.apiUrl}rest/v1/projects_members?project_id=eq.${this.projectId}`, { headers }).subscribe({
      next: (data) => {
        this.members = data;
      },
      error: (err) => {
        console.error('Failed to load members', err);
      }
    });
  }

  formatEpicLabel(epic: any): string {
    const title = epic.title && epic.title.length > 100 ? epic.title.substring(0, 100) + '...' : (epic.title || '');
    return `${epic.epic_id || ''} ${title}`;
  }

  onBack(): void {
    this.router.navigate(['/project', this.projectId, 'tasks']);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

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

    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    });

    this.http.post(`${this.apiUrl}rest/v1/tasks`, payload, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/project', this.projectId, 'tasks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to create task. Please try again.';
        console.error('Error creating task:', err);
      }
    });
  }
}