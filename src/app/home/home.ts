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
    {
      id: 1,
      name: 'Magic Teddy Bear',
      price: 19.99,
      image: 'assets/toy1.png'
    },
    {
      id: 2,
      name: 'Building Blocks Set',
      price: 24.99,
      image: 'public/magic-teddy-bear.jpg'
    },
    {
      id: 3,
      name: 'Remote Control Car',
      price: 34.99,
      image: 'assets/toy3.png'
    }
  ];

  categories = [
    'Educational Toys',
    'Soft Toys',
    'Outdoor Fun',
    'Creative Sets',
    'Baby Toys',
    'Games & Puzzles'
  ];

  constructor(private router: Router) {}

  goToToy(id: number) {
    this.router.navigate(['/toy', id]);
  }
}
