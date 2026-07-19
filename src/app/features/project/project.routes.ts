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
  {
    path: 'details',
    loadComponent: () => import('../../features/details/details.component').then(m => m.DetailsComponent),
  },
  {
    path: 'epics',
    loadComponent: () => import('../../features/epics/epics.component').then(m => m.EpicsComponent),
  },
  {
    path: 'tasks',
    loadComponent: () => import('../../features/tasks/tasks.component').then(m => m.TasksComponent),
  },
 
  {
    path: 'members',
    loadComponent: () => import('../../features/members/members.component').then(m => m.MembersComponent),
  },
];
