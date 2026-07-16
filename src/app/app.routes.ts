import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', 
    redirectTo: 'sign-up', 
    pathMatch: 'full'
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      { 
        path: '', 
        redirectTo: 'projects', 
        pathMatch: 'full' 
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];