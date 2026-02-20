import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [
    { id: 1, name: 'Toy Lover', email: 'ks@ks', role: 'Admin' },
    { id: 2, name: 'Play Master', email: 'play@toy.com', role: 'User' },
    { id: 3, name: 'Fun Builder', email: 'fun@toy.com', role: 'User' }
  ];

  filteredUsers: User[] = [];

  search = '';
  selectedRole = 'all';

  adminCount = 0;
  userCount = 0;

  ngOnInit() {
    this.refreshStats();
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.users];

    if (this.search) {
      const term = this.search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    if (this.selectedRole !== 'all') {
      result = result.filter(u => u.role === this.selectedRole);
    }

    this.filteredUsers = result;
    this.refreshStats();
  }

  refreshStats() {
    this.adminCount = this.users.filter(u => u.role === 'Admin').length;
    this.userCount = this.users.filter(u => u.role === 'User').length;
  }

  editUser(user: User) {
    alert(`Edit user: ${user.name}`);
  }

  deleteUser(user: User) {
    if (!confirm(`Delete "${user.name}"?`)) return;
    this.users = this.users.filter(u => u.id !== user.id);
    this.applyFilters();
  }
}
