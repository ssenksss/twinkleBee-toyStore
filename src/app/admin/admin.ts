import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
