import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'sign-up',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m =>m.LoginComponent),
  },
  // {
  //   path: 'project',
  //   loadComponent: () => import('./pages/project/project.component').then(m => m.ProjectComponent),
  //   children:[
  //     {
  //       path:'add-project',
  //       loadComponent: () => import('./pages/project/add-project/add-project.component').then(m=>m.AddProjectComponent)
  //     }
  //   ]

  // },
  //  {
  //   path: 'forget-password',
  //   loadComponent: () => import('./pages/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)

  // },

  {
    path: '', redirectTo: 'sign-up', pathMatch: 'full'
  },

];