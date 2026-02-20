import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(
      localStorage.getItem('tw_current_user') || 'null'
    );

    if (user && user.role === 'Admin') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
