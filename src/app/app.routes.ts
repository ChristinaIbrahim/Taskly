import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', 
    redirectTo: 'sign-up', 
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
     path: 'forget-password',
    loadComponent: () => import('./features/auth/forget-password/forget-password.component').then(m =>m.ForgetPasswordComponent),
  },
   {
     path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  {
    path: '',
    loadComponent: () => import('./core/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      
      {
      path: 'projects',
      loadChildren: () => import('./features/project/project.routes').then(m => m.routes)
    } 
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];