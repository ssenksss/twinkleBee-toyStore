import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToyService } from './toy.service';
import { ToyStatus, Review } from 'src/models/toy.model';

export interface CartItem {
  id: number;
  toyId: number;
  name: string;
  price: number;
  image: string;
  type: any;
  ageMin: number;
  ageMax: number;
  targetGroup: string;
  manufactureDate: string;
  quantity: number;
  status: ToyStatus;
  userRating?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private STORAGE_KEY = 'tw_cart';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private toyService: ToyService) {
    this.emitCount(this.getItems());
  }

  private save(items: CartItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.emitCount(items);
  }

  private emitCount(items: CartItem[]) {
    const count = items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
    this.cartCountSubject.next(count);
  }

  getItems(): CartItem[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];
    this.emitCount(items);
    return items;
  }

  addItem(toy: any, quantity: number = 1) {
    const items = this.getItems();

    const newItem: CartItem = {
      id: Date.now(),
      toyId: toy.id,
      name: toy.name,
      price: toy.price,
      image: toy.image,
      type: toy.type,
      ageMin: toy.ageMin,
      ageMax: toy.ageMax,
      targetGroup: toy.targetGroup,
      manufactureDate: toy.manufactureDate,
      quantity: Math.max(1, Math.floor(quantity || 1)),
      status: 'rezervisano'
    };

    items.push(newItem);
    this.save(items);
  }

  updateQuantity(id: number, quantity: number) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.quantity = Math.max(1, Math.floor(quantity || 1));
    this.save(items);
  }

  updateStatus(id: number, status: ToyStatus) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.status = status;
    this.save(items);
  }

  removeItem(id: number) {
    const items = this.getItems().filter(i => i.id !== id);
    this.save(items);
  }

  setRating(id: number, rating: number) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.userRating = rating;

    const review: Review = {
      rating,
      text: `User rating (${rating}/5)`,
      date: new Date().toISOString(),
      authorType: 'roditelj'
    };

    this.toyService.addReview(item.toyId, review);

    this.save(items);
  }

  getTotal(): number {
    return this.getItems()
      .filter(i => i.status === 'rezervisano')
      .reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
