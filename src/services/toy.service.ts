import { Injectable } from '@angular/core';
import { TOYS, TOY_TYPES } from '../data/toys.data';
import { Review, Toy, ToyType } from 'src/models/toy.model';

@Injectable({
  providedIn: 'root'
})
export class ToyService {
  private readonly STORAGE_KEY = 'tw_toys';
  private readonly VERSION_KEY = 'tw_toys_version';
  private readonly VERSION = 'v3';

  constructor() {
    this.seedIfNeeded();
  }

  private seedIfNeeded(): void {
    const existingVersion = localStorage.getItem(this.VERSION_KEY);

    if (existingVersion !== this.VERSION) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(TOYS));
      localStorage.setItem(this.VERSION_KEY, this.VERSION);
    }
  }

  private save(toys: Toy[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toys));
  }

  getToys(): Toy[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getToyById(id: number): Toy | undefined {
    return this.getToys().find(toy => toy.id === id);
  }

  getToyTypes(): ToyType[] {
    return TOY_TYPES;
  }

  getFeaturedToys(limit: number = 3): Toy[] {
    return this.getToys().slice(0, limit);
  }

  addReview(toyId: number, review: Review): void {
    const toys = this.getToys();
    const toy = toys.find(t => t.id === toyId);

    if (!toy) return;

    toy.reviews = toy.reviews || [];
    toy.reviews.unshift(review);

    this.save(toys);
  }
}
