import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  featuredToys = [
    { id: 1, name: 'Cuddle Bear Plush', price: 19.99, image: '/cuddle-bear.png' },
    { id: 2, name: 'Smart Builder Blocks Set', price: 24.99, image: '/smart-builder-block-set.png' },
    { id: 3, name: 'Turbo Racer RC Car', price: 34.99, image: '/turbo-racer-rc-car.png' }
  ];

  categories = [
    { label: 'Educational Toys', typeId: 1 },
    { label: 'Soft Toys', typeId: 2 },
    { label: 'Outdoor Fun', typeId: 3 },
    { label: 'Creative Sets', typeId: 4 },
    { label: 'Baby Toys', typeId: 5 },
    { label: 'Games & Puzzles', typeId: 6 }
  ];

  constructor(private router: Router) {}

  goToToy(id: number) {
    this.router.navigate(['/toy', id]);
  }

  goToCategory(typeId: number) {
    this.router.navigate(['/shop'], { queryParams: { typeId } });
  }
}
