import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToyService } from 'src/services/toy.service';
import { ToyType } from 'src/models/toy.model';

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  phone = '';
  address = '';

  email = '';
  password = '';

  types: ToyType[] = [];
  favoriteTypeIds: number[] = [];

  error = '';
  fieldError: FieldErrors = {};

  constructor(
    private auth: AuthService,
    private toyService: ToyService,
    private router: Router
  ) {
    this.types = this.toyService.getToyTypes();
  }

  toggleFavorite(typeId: number) {
    if (this.favoriteTypeIds.includes(typeId)) {
      this.favoriteTypeIds = this.favoriteTypeIds.filter(id => id !== typeId);
    } else {
      this.favoriteTypeIds = [...this.favoriteTypeIds, typeId];
    }
  }

  submit() {
    this.clearErrors();
    if (!this.validate()) return;

    const success = this.auth.signup({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      favoriteTypeIds: this.favoriteTypeIds,
      email: this.email.trim(),
      password: this.password
    });

    if (!success) {
      this.error = 'An account with this email already exists';
      return;
    }

    this.auth.login(this.email, this.password);
    this.router.navigate(['/profile']);
  }

  validate(): boolean {
    const e: FieldErrors = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);

    if (!this.firstName.trim()) e.firstName = 'First name is required';
    if (!this.lastName.trim()) e.lastName = 'Last name is required';
    if (!this.phone.trim()) e.phone = 'Phone is required';
    if (!this.address.trim()) e.address = 'Address is required';

    if (!this.email.trim()) e.email = 'Email is required';
    else if (!emailOk) e.email = 'Enter a valid email';

    if (!this.password.trim()) e.password = 'Password is required';
    else if (this.password.length < 6) e.password = 'Minimum 6 characters';

    this.fieldError = e;
    return Object.keys(e).length === 0;
  }

  clearErrors() {
    this.error = '';
    this.fieldError = {};
  }
}
