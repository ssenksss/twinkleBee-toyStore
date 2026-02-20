import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../services/admin.data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  usersCount = 0;
  productsCount = 0;
  ordersCount = 0;
  revenue = 0;

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.adminData.getUsers().subscribe(users => {
      this.animateValue('usersCount', users.length);
    });

    this.adminData.getProducts().subscribe(products => {
      this.animateValue('productsCount', products.length);
    });

    this.adminData.getOrders().subscribe(orders => {
      this.animateValue('ordersCount', orders.length);

      const total = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      this.animateValue('revenue', total);
    });
  }

  animateValue(field: keyof DashboardComponent, target: number) {
    let current = 0;
    const step = Math.ceil(target / 30);

    const interval = setInterval(() => {
      current += step;

      if (current >= target) {
        this[field] = target as any;
        clearInterval(interval);
      } else {
        this[field] = current as any;
      }
    }, 30);
  }
}
