import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ToyCardComponent } from './toy.component';
import { CartService } from 'src/services/cart.service';
import { ToyService } from 'src/services/toy.service';
import { AuthService } from 'src/services/auth.service';
import { Toy } from 'src/models/toy.model';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-toy-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToyCardComponent],
  templateUrl: './toy.html',
  styleUrls: ['./toy.css']
})
export class ToyComponent implements OnInit {
  toy!: Toy;
  quantity = 1;
  relatedToys: Toy[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private toyService: ToyService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    const found = this.toyService.getToyById(id);
    this.toy = found ?? this.toyService.getToys()[0];

    this.relatedToys = this.toyService
      .getToys()
      .filter(t => t.id !== this.toy.id && t.type.id === this.toy.type.id)
      .slice(0, 2);
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      localStorage.setItem('tw_to', this.router.url);

      this.toast.show('Please login to reserve toys 🐝');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addItem(this.toy, this.quantity);
    this.toast.show(`${this.toy.name} added to cart 🧸`);
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

  avgRating(toy: Toy): number | null {
    if (!toy.reviews?.length) return null;
    const sum = toy.reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return Math.round((sum / toy.reviews.length) * 10) / 10;
  }

  stars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
