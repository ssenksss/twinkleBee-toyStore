import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class ReservationComponent implements OnInit {

  toyType = '';
  color = '';
  size = '';
  date = '';
  notes = '';

  error = '';
  success = '';

  myReservations: Reservation[] = [];

  constructor(
    private reservations: ReservationService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadMyReservations();
  }

  submit() {
    this.error = '';
    this.success = '';

    if (!this.toyType || !this.color || !this.size || !this.date) {
      this.error = 'Please fill all required fields';
      return;
    }

    const user = this.auth.getCurrentUser();
    if (!user) {
      this.error = 'You must be logged in to reserve a toy';
      return;
    }

    this.reservations.create(
      this.toyType,
      this.color,
      this.size,
      this.date,
      this.notes,
      user.email
    );

    this.success = 'Your handmade toy has been reserved 🧶🐝';

    this.toyType = '';
    this.color = '';
    this.size = '';
    this.date = '';
    this.notes = '';

    this.loadMyReservations();
  }

  loadMyReservations() {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.myReservations = this.reservations.getByUser(user.email);
  }
}
