import { Injectable } from '@angular/core';
import { TOYS, TOY_TYPES } from '../data/toys.data';
import { Toy, Review } from 'src/models/toy.model';

@Injectable({ providedIn: 'root' })
export class ToyService {

  private STORAGE_KEY = 'tw_toys';
  private VERSION_KEY = 'tw_toys_version';
  private VERSION = 'v2';

  constructor() {
    this.seedIfEmpty();
  }

  // ✅ VERSION-BASED SEED
  private seedIfEmpty() {
    const existingVersion = localStorage.getItem(this.VERSION_KEY);

    if (existingVersion !== this.VERSION) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(TOYS));
      localStorage.setItem(this.VERSION_KEY, this.VERSION);
    }
  }

  private save(t: Toy[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(t));
  }

  getToys(): Toy[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getToyById(id: number): Toy | undefined {
    return this.getToys().find(t => t.id === id);
  }

  getToyTypes() {
    return TOY_TYPES;
  }

  addReview(toyId: number, review: Review) {
    const toys = this.getToys();
    const toy = toys.find(t => t.id === toyId);
    if (!toy) return;

    toy.reviews = toy.reviews || [];
    toy.reviews.unshift(review);

    this.save(toys);
  }
}
