import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from 'src/services/cart.service';
import { ToyStatus } from 'src/models/toy.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  notice: string | null = null;

  statuses: { value: ToyStatus; label: string }[] = [
    { value: 'rezervisano', label: 'Rezervisano' },
    { value: 'pristiglo', label: 'Pristiglo' },
    { value: 'otkazano', label: 'Otkazano' }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
  }

  private show(msg: string) {
    this.notice = msg;
    window.setTimeout(() => {
      this.notice = null;
    }, 2600);
  }

  increase(item: CartItem) {
    if (item.status !== 'rezervisano') {
      this.show('Količina se menja samo kada je status "rezervisano".');
      return;
    }
    this.cartService.updateQuantity(item.id, item.quantity + 1);
    this.cartItems = this.cartService.getItems();
  }

  decrease(item: CartItem) {
    if (item.status !== 'rezervisano') {
      this.show('Količina se menja samo kada je status "rezervisano".');
      return;
    }
    this.cartService.updateQuantity(item.id, item.quantity - 1);
    this.cartItems = this.cartService.getItems();
  }

  onQuantityInput(item: CartItem) {
    if (item.status !== 'rezervisano') {
      this.show('Količina se menja samo kada je status "rezervisano".');
      return;
    }
    this.cartService.updateQuantity(item.id, item.quantity);
    this.cartItems = this.cartService.getItems();
  }

  onStatusChange(item: CartItem, status: ToyStatus) {
    this.cartService.updateStatus(item.id, status);
    this.cartItems = this.cartService.getItems();

    if (status !== 'pristiglo') {
      this.show('Ocena i brisanje su dostupni tek kada je status "pristiglo".');
    }
  }

  remove(item: CartItem) {
    if (item.status !== 'pristiglo') {
      this.show('Možeš obrisati samo igračke koje su u statusu "pristiglo".');
      return;
    }
    this.cartService.removeItem(item.id);
    this.cartItems = this.cartService.getItems();
    this.show('Obrisano iz korpe.');
  }

  setRating(item: CartItem, rating: number) {
    if (item.status !== 'pristiglo') {
      this.show('Možeš oceniti samo igračke koje su "pristiglo".');
      return;
    }
    this.cartService.setRating(item.id, rating);
    this.cartItems = this.cartService.getItems();
    this.show('Hvala na oceni! ⭐');
  }

  stars(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  statusLabel(s: ToyStatus): string {
    const found = this.statuses.find(x => x.value === s);
    return found ? found.label : s;
  }

  get total() {
    return this.cartService.getTotal();
  }

  canCheckout(): boolean {
    return this.cartItems.some(i => i.status === 'rezervisano');
  }
}
