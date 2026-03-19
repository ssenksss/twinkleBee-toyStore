import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from 'src/services/reservation.service';
import { AuthService } from 'src/services/auth.service';
import { Reservation } from 'src/models/reservation.model';
import { Router } from '@angular/router';
import { ToastService } from 'src/services/toast.service';

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
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.restoreDraft();
    this.loadMyReservations();
  }

  private restoreDraft() {
    const saved = localStorage.getItem('tw_reservation_draft');
    if (!saved) return;

    try {
      const draft = JSON.parse(saved);
      this.toyType = draft.toyType ?? '';
      this.color = draft.color ?? '';
      this.size = draft.size ?? '';
      this.date = draft.date ?? '';
      this.notes = draft.notes ?? '';
    } catch {
      localStorage.removeItem('tw_reservation_draft');
    }
  }

  submit() {
    this.error = '';
    this.success = '';

    if (!this.toyType || !this.color || !this.size || !this.date) {
      this.error = 'Please fill all required fields.';
      return;
    }

    const user = this.auth.getCurrentUser();

    if (!user) {
      localStorage.setItem('tw_to', '/reserve');

      localStorage.setItem('tw_reservation_draft', JSON.stringify({
        toyType: this.toyType,
        color: this.color,
        size: this.size,
        date: this.date,
        notes: this.notes
      }));

      this.toast.show('Please log in to reserve your handmade toy 🐝');
      this.router.navigate(['/login']);
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

    this.success = `Your handmade toy has been reserved successfully!

Thank you for choosing TwinkleBee Atelier!`;

    this.toyType = '';
    this.color = '';
    this.size = '';
    this.date = '';
    this.notes = '';

    localStorage.removeItem('tw_reservation_draft');

    this.loadMyReservations();
  }

  loadMyReservations() {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.myReservations = this.reservations.getByUser(user.email);
  }
}
