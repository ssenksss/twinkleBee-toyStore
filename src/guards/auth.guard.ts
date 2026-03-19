import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { ToastService } from 'src/services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isLoggedIn()) return true;

  localStorage.setItem('tw_to', state.url);
  toast.show('Please log in to continue 🐝');
  router.navigate(['/login']);
  return false;
};
