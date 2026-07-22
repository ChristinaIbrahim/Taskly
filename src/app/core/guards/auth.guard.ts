import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const access_token = authService.getToken() || localStorage.getItem(STORAGE_KEYS.USER_TOKEN);

  if (access_token && environment.supabase_api_key) {
    return true; 
  }

  return router.navigateByUrl('/login');
};