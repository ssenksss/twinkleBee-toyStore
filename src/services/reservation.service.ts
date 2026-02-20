

import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private reservations: Reservation[] = [];

  create(toyType: string, color: string, size: string, date: string, notes: string, userEmail: string) {
    const newReservation: Reservation = {
      id: this.reservations.length + 1,
      toyType,
      color,
      size,
      date,
      notes,
      userEmail,
      phone: '',
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    this.reservations.push(newReservation);
  }

  getByUser(userEmail: string): Reservation[] {
    return this.reservations.filter(r => r.userEmail === userEmail);
  }
}
