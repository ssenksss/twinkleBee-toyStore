import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';
  showPassword = false;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (this.loading) return;

    this.error = '';
    this.success = '';

    const ok = this.auth.login(this.email.trim(), this.password.trim());

    if (!ok) {
      this.error = 'Invalid credentials';
      return;
    }

    this.success = 'Login successful. Redirecting...';
    this.loading = true;

    setTimeout(() => {
      const returnUrl = localStorage.getItem('tw_to');

      if (returnUrl) {
        localStorage.removeItem('tw_to');
        this.router.navigateByUrl(returnUrl);
        return;
      }

      if (this.auth.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/profile']);
      }
    }, 800);
  }
}
