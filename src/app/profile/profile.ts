import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, User } from 'src/services/auth.service';
import { ToyService } from 'src/services/toy.service';
import { ToyType } from 'src/models/toy.model';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent {
  user!: User;
  types: ToyType[] = [];

  firstName = '';
  lastName = '';
  phone = '';
  address = '';
  favoriteTypeIds: number[] = [];

  constructor(
    private auth: AuthService,
    private toyService: ToyService,
    private router: Router,
    private toast: ToastService
  ) {
    const u = this.auth.getCurrentUser();

    if (!u) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = u;
    this.types = this.toyService.getToyTypes();

    this.firstName = u.firstName;
    this.lastName = u.lastName;
    this.phone = u.phone;
    this.address = u.address;
    this.favoriteTypeIds = [...(u.favoriteTypeIds ?? [])];
  }

  get initials(): string {
    const first = this.firstName?.trim()?.charAt(0) || this.user?.firstName?.charAt(0) || '';
    const last = this.lastName?.trim()?.charAt(0) || this.user?.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get favoriteTypesPreview(): ToyType[] {
    return this.types.filter(t => this.favoriteTypeIds.includes(t.id));
  }

  toggleFavorite(typeId: number) {
    if (this.favoriteTypeIds.includes(typeId)) {
      this.favoriteTypeIds = this.favoriteTypeIds.filter(id => id !== typeId);
    } else {
      this.favoriteTypeIds = [...this.favoriteTypeIds, typeId];
    }
  }

  saveProfile() {
    const ok = this.auth.updateCurrentUserProfile({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      favoriteTypeIds: this.favoriteTypeIds
    });

    if (!ok) {
      this.toast.show('Profile could not be updated.');
      return;
    }

    const refreshed = this.auth.getCurrentUser();
    if (refreshed) {
      this.user = refreshed;
    }

    this.toast.show('Profile updated successfully ✨');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
