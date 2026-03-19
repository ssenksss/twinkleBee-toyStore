import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/services/cart.service';
import { ToastService } from 'src/services/toast.service';
import { ToyService } from 'src/services/toy.service';
import { Toy } from 'src/models/toy.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  featuredToys: Toy[] = [];
  categories = [
    { label: 'Educational Toys', typeId: 1 },
    { label: 'Soft Toys', typeId: 2 },
    { label: 'Outdoor Fun', typeId: 3 },
    { label: 'Creative Sets', typeId: 4 },
    { label: 'Baby Toys', typeId: 5 },
    { label: 'Games & Puzzles', typeId: 6 }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private toast: ToastService,
    private toyService: ToyService
  ) {
    this.featuredToys = this.toyService.getFeaturedToys(3);
  }

  goToToy(id: number) {
    this.router.navigate(['/toy', id]);
  }

  addToCart(toy: Toy) {
    this.cartService.addItem(toy);
    this.toast.show(`${toy.name} added to cart!`);
  }

  goToCategory(typeId: number) {
    this.router.navigate(['/shop'], { queryParams: { typeId } });
  }

  avgRating(toy: Toy): number | null {
    if (!toy.reviews?.length) return null;
    const sum = toy.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / toy.reviews.length) * 10) / 10;
  }
}
