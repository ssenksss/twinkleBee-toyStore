import { Injectable } from '@angular/core';

export interface User {
  email: string;
  password: string;

  firstName: string;
  lastName: string;
  phone: string;
  address: string;

  favoriteTypeIds: number[];

  role: 'Admin' | 'User';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'tw_users';
  private currentKey = 'tw_current_user';

  private seedUsers: User[] = [
    {
      firstName: 'Twinkle',
      lastName: 'Admin',
      email: 'admin@twinklebee.com',
      password: 'admin123',
      phone: '+381 60 000 000',
      address: 'Beograd',
      favoriteTypeIds: [1, 3, 6],
      role: 'Admin'
    },
    {
      firstName: 'Toy',
      lastName: 'User',
      email: 'user@twinklebee.com',
      password: 'user123',
      phone: '+381 60 111 111',
      address: 'Kraljevo',
      favoriteTypeIds: [2, 5],
      role: 'User'
    }
  ];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const users = localStorage.getItem(this.usersKey);
    if (!users) {
      localStorage.setItem(this.usersKey, JSON.stringify(this.seedUsers));
      console.log('🐝 Seeded default admin and user');
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  saveUsers(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  signup(user: Omit<User, 'role'>): boolean {
    const users = this.getUsers();
    const exists = users.find(u => u.email === user.email);
    if (exists) return false;

    const newUser: User = {
      ...user,
      role: 'User'
    };

    users.push(newUser);
    this.saveUsers(users);
    return true;
  }


  login(email: string, password: string): boolean {
    const users = this.getUsers();

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return false;

    localStorage.setItem(this.currentKey, JSON.stringify(user));
    return true;
  }


  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem(this.currentKey) || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'Admin';
  }

  logout() {
    localStorage.removeItem(this.currentKey);
  }

  updateCurrentUserProfile(patch: Partial<Omit<User, 'role' | 'email' | 'password'>>): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;

    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === current.email);

    const updated: User = {
      ...current,
      ...patch
    };

    if (idx !== -1) {
      users[idx] = updated;
      this.saveUsers(users);
    }

    localStorage.setItem(this.currentKey, JSON.stringify(updated));
    return true;
  }

  updateFavoriteTypes(typeIds: number[]): boolean {
    return this.updateCurrentUserProfile({ favoriteTypeIds: typeIds });
  }
}
