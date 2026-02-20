import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Toy } from 'src/models/toy.model';

@Component({
  selector: 'app-toy-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="toy-card">

      <div class="image-wrap">
        <img [src]="toy.image" alt="toy" />
        <span class="category-badge">
        {{ toy.type?.label }}
      </span>
      </div>

      <div class="toy-content">
        <h3>{{ toy.name }}</h3>

        <div class="meta">
          <span>{{ toy.ageMin }}-{{ toy.ageMax }} god.</span>
          <span class="dot">•</span>
          <span>{{ targetGroupLabel(toy.targetGroup) }}</span>
        </div>

        <div class="price">
          {{ toy.price | currency:'RSD':'symbol':'1.0-0' }}
        </div>

        <div class="rating" *ngIf="avgRating(toy) as r">
          <span class="stars">{{ stars(r) }}</span>
          <span class="small">({{ r }}/5)</span>
        </div>

        <a class="view-btn" [routerLink]="['/toy', toy.id]">
          View Toy
        </a>
      </div>

    </div>
  `,
  styleUrls: ['./toy.card.css']
})
export class ToyCardComponent {
  @Input() toy!: Toy;

  avgRating(toy: Toy): number | null {
    if (!toy.reviews?.length) return null;
    const sum = toy.reviews.reduce((acc, x) => acc + (x.rating ?? 0), 0);
    return Math.round((sum / toy.reviews.length) * 10) / 10;
  }

  stars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  targetGroupLabel(v: Toy['targetGroup']): string {
    switch (v) {
      case 'devojcica':
        return 'Devojčica';
      case 'decak':
        return 'Dečak';
      default:
        return 'Svi';
    }
  }
}
