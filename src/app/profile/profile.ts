import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService, User } from 'src/services/auth.service';
import { ToyService } from 'src/services/toy.service';
import { ToyType } from 'src/models/toy.model';

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
  savedMsg = '';

  firstName = '';
  lastName = '';
  phone = '';
  address = '';
  favoriteTypeIds: number[] = [];

  constructor(
    private auth: AuthService,
    private toyService: ToyService,
    private router: Router
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

    if (ok) {
      const refreshed = this.auth.getCurrentUser();
      if (refreshed) this.user = refreshed;
      this.savedMsg = 'Saved ✅';
      setTimeout(() => (this.savedMsg = ''), 1500);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
