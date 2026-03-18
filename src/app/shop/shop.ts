import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToyCardComponent } from '../toy/toy.component';
import { ToyService } from 'src/services/toy.service';
import { TargetGroup, Toy, ToyType } from 'src/models/toy.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToyCardComponent],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css']
})
export class ShopComponent {
  toys: Toy[] = [];
  types: ToyType[] = [];

  f = {
    name: '',
    description: '',
    typeId: 'all' as 'all' | number,
    targetGroup: 'all' as 'all' | TargetGroup,
    age: null as null | number,
    manufacturedFrom: '',
    manufacturedTo: '',
    priceMin: null as null | number,
    priceMax: null as null | number,
    reviewText: '',
    minReviewRating: 'all' as 'all' | number
  };

  constructor(private toyService: ToyService, private route: ActivatedRoute) {
    this.toys = this.toyService.getToys();
    this.types = this.toyService.getToyTypes();

    // Pre-select type if navigated from Home "Shop by Category"
    this.route.queryParamMap.subscribe(params => {
      const raw = params.get('typeId');
      if (!raw) return;
      const n = Number(raw);
      if (!Number.isFinite(n)) return;
      this.f.typeId = n as any;
    });
  }

  clearFilters() {
    this.f = {
      name: '',
      description: '',
      typeId: 'all',
      targetGroup: 'all',
      age: null,
      manufacturedFrom: '',
      manufacturedTo: '',
      priceMin: null,
      priceMax: null,
      reviewText: '',
      minReviewRating: 'all'
    };
  }

  get filteredToys(): Toy[] {
    const normalize = (s: string) => (s ?? '').trim().toLowerCase();
    const nName = normalize(this.f.name);
    const nDesc = normalize(this.f.description);
    const nReview = normalize(this.f.reviewText);

    const from = this.f.manufacturedFrom ? new Date(this.f.manufacturedFrom) : null;
    const to = this.f.manufacturedTo ? new Date(this.f.manufacturedTo) : null;

    return this.toys.filter(toy => {
      if (nName && !toy.name.toLowerCase().includes(nName)) return false;
      if (nDesc && !toy.description.toLowerCase().includes(nDesc)) return false;
      if (this.f.typeId !== 'all' && toy.type?.id !== this.f.typeId) return false;
      if (this.f.targetGroup !== 'all' && toy.targetGroup !== this.f.targetGroup) return false;
      if (this.f.age !== null && !(toy.ageMin <= this.f.age && this.f.age <= toy.ageMax)) return false;
      if (from || to) {
        const d = new Date(toy.manufactureDate);
        if (from && d < from) return false;
        if (to && d > to) return false;
      }
      if (this.f.priceMin !== null && toy.price < this.f.priceMin) return false;
      if (this.f.priceMax !== null && toy.price > this.f.priceMax) return false;
      if (nReview && !(toy.reviews ?? []).some(r => (r.text ?? '').toLowerCase().includes(nReview))) return false;
      if (this.f.minReviewRating !== 'all') {
        const min = Number(this.f.minReviewRating);
        if (!(toy.reviews ?? []).some(r => (r.rating ?? 0) >= min)) return false;
      }
      return true;
    });
  }

  targetGroupLabel(v: 'all' | TargetGroup): string {
    if (v === 'all') return 'Everyone';
    switch (v) {
      case 'girls':
        return 'Girls';
      case 'boys':
        return 'Boys';
      default:
        return 'Unisex';
    }
  }
}
