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

  touched = { fullName: false, phone: false, address: false };
  outcome: DeliveryOutcome = 'allArrived';
  submitting = false;
  errorMsg = '';
  successMsg = '';
  orderId = '';

  constructor(private auth: AuthService, private cart: CartService, private router: Router) {}

  ngOnInit() {
    const u = this.auth.getCurrentUser();
    if (!u) { this.router.navigate(['/login']); return; }
    this.user = u;
    this.fullName = `${u.firstName} ${u.lastName}`.trim();
    this.email = u.email ?? '';
    this.phone = (u.phone ?? '').trim();
    this.address = (u.address ?? '').trim();
    this.refreshItems();
  }

  private refreshItems() {
    this.items = this.cart.getItems().filter(i => i.status === 'reserved');
  }

  get total() { return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0); }

  private isValidFullName(v: string) { return (v ?? '').trim().length >= 3 && v.includes(' '); }
  private isValidPhone(v: string) { return /^[+]?[\d\s\-()]{7,20}$/.test((v ?? '').trim()); }
  private isValidAddress(v: string) { return (v ?? '').trim().length >= 6; }

  fullNameError() {
    if (!this.touched.fullName) return '';
    if (!this.fullName.trim()) return 'Required.';
    if (!this.isValidFullName(this.fullName)) return 'Enter full name (e.g., "Ksenija Raković").';
    return '';
  }

  phoneError() {
    if (!this.touched.phone) return '';
    if (!this.phone.trim()) return 'Required.';
    if (!this.isValidPhone(this.phone)) return 'Invalid phone format (e.g., +381 64 123 456).';
    return '';
  }

  addressError() {
    if (!this.touched.address) return '';
    if (!this.address.trim()) return 'Required.';
    if (!this.isValidAddress(this.address)) return 'Address is too short.';
    return '';
  }

  canSubmit(): boolean {
    return this.items.length > 0 &&
      this.isValidFullName(this.fullName) &&
      this.isValidPhone(this.phone) &&
      this.isValidAddress(this.address) &&
      !this.submitting;
  }

  confirmOrder() {
    this.errorMsg = ''; this.successMsg = '';
    this.touched.fullName = true; this.touched.phone = true; this.touched.address = true;

    if (this.items.length === 0) { this.errorMsg = 'No reserved items in cart.'; return; }
    if (!this.canSubmit()) {
      this.errorMsg = 'Please fill in all required fields correctly before confirming the order.';
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

    const arrivedCount = reserved.filter((_, idx) => this.computeStatusAfterCheckout(idx, reserved.length) === 'arrived').length;
    const canceledCount = reserved.length - arrivedCount;

    this.successMsg = `Your order has been successfully placed!
    Order ID: ${this.orderId}
    ${arrivedCount} item(s) will arrive soon
  ${canceledCount} item(s) are currently unavailable

Thank you for shopping with us!`;
    setTimeout(() => this.router.navigate(['/cart']), 4500);
  }

  private computeStatusAfterCheckout(index: number, total: number): ToyStatus {
    if (this.outcome === 'allArrived') return 'arrived';
    if (total <= 1) return 'arrived';
    return (index % 4 === 3) ? 'canceled' : 'arrived';
  }

  goBack() { this.router.navigate(['/cart']); }
}
