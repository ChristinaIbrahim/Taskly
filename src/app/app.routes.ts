import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'project',
    loadComponent: () => import('./pages/project/project.component').then(m => m.ProjectComponent)

  },

  {
    path: '', redirectTo: 'sign-up', pathMatch: 'full'
  },

];