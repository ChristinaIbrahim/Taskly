import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../core/services/auth.service';
import { BreadcrumbComponent , BreadcrumbItem} from '../../../../shared/components/breadcrumb/breadcrumb.component';

interface Epic {
  id?: string | number;
  epic_id?: string;
  title?: string;
}

interface ProjectMember {
  id?: string | number;
  user_id?: string | number;
  name?: string;
  user_name?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,BreadcrumbComponent],
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.css'],
})
export class AddNewTaskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  taskForm!: FormGroup;
  projectId = '';
  epics: Epic[] = [];
  members: ProjectMember[] = [];
  isLoading = false;
  errorMessage = '';

breadcrumbItems: BreadcrumbItem[] = [
    { label: 'PROJECTS', link: '/project' },
    { label: 'PROJECT ALPHA', link: '' },
    { label: 'TASKS', link: '' },
    { label: 'NEW TASK' }
  ];

  statuses = [
    { key: 'TO_DO', label: 'TO DO' },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS' },
    { key: 'BLOCKED', label: 'BLOCKED' },
    { key: 'IN_REVIEW', label: 'IN REVIEW' },
    { key: 'READY_FOR_QA', label: 'READY FOR QA' },
    { key: 'REOPENED', label: 'REOPENED' },
    { key: 'READY_FOR_PRODUCTION', label: 'READY FOR PRODUCTION' },
    { key: 'DONE', label: 'DONE' },
  ];

  private apiUrl = environment.supabaseUrl;
  private apiKey = environment.supabase_api_key;

  ngOnInit(): void {
    this.projectId = this.getProjectIdFromRoute();

    const prefilledEpicId = this.route.snapshot.queryParamMap.get('epic_id');
    const prefilledStatus = this.route.snapshot.queryParamMap.get('status');

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      status: [prefilledStatus || 'TO_DO', Validators.required],
      epic_id: [prefilledEpicId || ''],
      assignee: [null],
      due_date: [''],
      description: [''],
    });

    if (this.projectId) {
      this.loadProjectEpics();
      this.loadProjectMembers();
    } else {
      this.errorMessage =
        'Could not determine the project. Please go back and try again.';
    }
  }

  private getProjectIdFromRoute(): string {
    let route: ActivatedRoute | null = this.route;
    while (route) {
      const id = route.snapshot.paramMap.get('id');
      if (id) return id;
      route = route.parent;
    }
    return '';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.authService.getToken() || ''}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    });
  }

  loadProjectEpics(): void {
    if (!this.projectId) return;

    this.http
      .get<Epic[]>(
        `${this.apiUrl}rest/v1/epics?project_id=eq.${this.projectId}`,
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: (data) => {
          this.epics = data;
        },
        error: (err: unknown) => {
          console.error('Failed to load epics', err);
        },
      });
  }

  loadProjectMembers(): void {
    if (!this.projectId) return;

    this.http
      .get<ProjectMember[]>(
        `${this.apiUrl}rest/v1/project_members?project_id=eq.${this.projectId}`,
        {
          headers: this.getHeaders(),
        },
      )
      .subscribe({
        next: (data) => {
          this.members = data;
        },
        error: (err: unknown) => {
          console.error('Failed to load members', err);
        },
      });
  }

  formatEpicLabel(epic: Epic): string {
    const title =
      epic.title && epic.title.length > 100
        ? epic.title.substring(0, 100) + '...'
        : epic.title || '';
    return `${epic.epic_id || ''} ${title}`;
  }

  onBack(): void {
    this.router.navigate(['/project', this.projectId, 'tasks']);
  }

  onSubmit(): void {
    if (this.taskForm.invalid || !this.projectId) {
      this.taskForm.markAllAsTouched();
      if (!this.projectId) {
        this.errorMessage =
          'Could not determine the project. Please go back and try again.';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.taskForm.value;
    const selectedMember = formValues.assignee;
    const memberId = selectedMember
      ? selectedMember.user_id || selectedMember.id || null
      : null;

    const payload: any = {
      project_id: this.projectId,
      title: formValues.title,
      status: formValues.status,
      epic_id: formValues.epic_id ? formValues.epic_id : null,
      due_date: formValues.due_date
        ? new Date(formValues.due_date).toISOString()
        : null,
      description: formValues.description ? formValues.description : null,
    };

    if (memberId) {
      console.log('');
    }

    this.http
      .post(`${this.apiUrl}rest/v1/tasks`, payload, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/project', this.projectId, 'tasks']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to create task. Please try again.';
          console.error('Error creating task:', err);
        },
      });
  }
}
