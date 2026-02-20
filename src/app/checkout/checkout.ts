import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CartItem, CartService } from 'src/services/cart.service';
import { AuthService, User } from 'src/services/auth.service';
import { ToyStatus } from 'src/models/toy.model';

type DeliveryOutcome = 'allArrived' | 'someCanceled';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  user!: User;

  items: CartItem[] = [];

  fullName = '';
  email = '';
  phone = '';
  address = '';
  note = '';

  touched = {
    fullName: false,
    phone: false,
    address: false
  };

  outcome: DeliveryOutcome = 'allArrived';
  submitting = false;

  errorMsg = '';
  successMsg = '';
  orderId = '';

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const u = this.auth.getCurrentUser();
    if (!u) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = u;

    this.fullName = `${u.firstName} ${u.lastName}`.trim();
    this.email = u.email ?? '';
    this.phone = (u.phone ?? '').trim();
    this.address = (u.address ?? '').trim();

    this.refreshItems();
  }

  private refreshItems() {
    this.items = this.cart.getItems().filter(i => i.status === 'rezervisano');
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  private isValidFullName(v: string) {
    const s = (v ?? '').trim();
    return s.length >= 3 && s.includes(' ');
  }

  private isValidPhone(v: string) {
    const s = (v ?? '').trim();
    return /^[+]?[\d\s\-()]{7,20}$/.test(s);
  }

  private isValidAddress(v: string) {
    const s = (v ?? '').trim();
    return s.length >= 6;
  }

  fullNameError(): string {
    if (!this.touched.fullName) return '';
    if (!this.fullName.trim()) return 'Obavezno polje.';
    if (!this.isValidFullName(this.fullName)) return 'Unesi ime i prezime (npr. "Ksenija Raković").';
    return '';
  }

  phoneError(): string {
    if (!this.touched.phone) return '';
    if (!this.phone.trim()) return 'Obavezno polje.';
    if (!this.isValidPhone(this.phone)) return 'Telefon nije u dobrom formatu (npr. +381 64 123 456).';
    return '';
  }

  addressError(): string {
    if (!this.touched.address) return '';
    if (!this.address.trim()) return 'Obavezno polje.';
    if (!this.isValidAddress(this.address)) return 'Adresa je prekratka.';
    return '';
  }

  canSubmit(): boolean {
    return (
      this.items.length > 0 &&
      this.isValidFullName(this.fullName) &&
      this.isValidPhone(this.phone) &&
      this.isValidAddress(this.address) &&
      !this.submitting
    );
  }

  confirmOrder() {
    this.errorMsg = '';
    this.successMsg = '';

    this.touched.fullName = true;
    this.touched.phone = true;
    this.touched.address = true;

    if (this.items.length === 0) {
      this.errorMsg = 'Nema stavki u statusu "rezervisano". Idi u korpu i dodaj rezervaciju.';
      return;
    }

    if (!this.canSubmit()) {
      this.errorMsg = 'Proveri obavezna polja (ime, telefon, adresa).';
      return;
    }

    this.submitting = true;

    this.orderId = `TW-${Date.now().toString().slice(-6)}`;

    const reserved = [...this.items];

    reserved.forEach((item, idx) => {
      const status: ToyStatus = this.computeStatusAfterCheckout(idx, reserved.length);
      this.cart.updateStatus(item.id, status);
    });

    this.refreshItems();

    this.submitting = false;

    const arrivedCount = reserved.filter((_, idx) => this.computeStatusAfterCheckout(idx, reserved.length) === 'pristiglo').length;
    const canceledCount = reserved.length - arrivedCount;

    this.successMsg =
      `Porudžbina potvrđena ✅ (Order: ${this.orderId}). ` +
      `Pristiglo: ${arrivedCount}, Otkazano: ${canceledCount}.`;

    setTimeout(() => this.router.navigate(['/cart']), 900);
  }

  private computeStatusAfterCheckout(index: number, total: number): ToyStatus {
    if (this.outcome === 'allArrived') return 'pristiglo';

    if (total <= 1) return 'pristiglo';

    return (index % 4 === 3) ? 'otkazano' : 'pristiglo';
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}
