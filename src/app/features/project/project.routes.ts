import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/project-list/project-list.component').then(
        (m) => m.ProjectListComponent,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/add-project/add-project.component').then(
        (m) => m.AddProjectComponent,
      ),
  },
];
