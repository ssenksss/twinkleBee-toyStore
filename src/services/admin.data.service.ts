import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  private usersSource = new BehaviorSubject<any[]>([
    { id: 1, name: 'Toy Lover', email: 'admin@twinklebee.com', role: 'Admin' },
    { id: 2, name: 'Play Master', email: 'user@twinklebee.com', role: 'User' }
  ]);

  private productsSource = new BehaviorSubject<any[]>([
    {
      id: 1,
      name: 'Teddy Bear',
      sku: 'TB-001',
      category: 'Plush',
      price: 19.99,
      stock: 10,
      active: true,
      image: 'https://via.placeholder.com/40'
    },
    {
      id: 2,
      name: 'Toy Car',
      sku: 'TC-002',
      category: 'Vehicles',
      price: 9.99,
      stock: 2,
      active: true,
      image: 'https://via.placeholder.com/40'
    },
    {
      id: 3,
      name: 'Puzzle',
      sku: 'PZ-003',
      category: 'Games',
      price: 14.99,
      stock: 0,
      active: false,
      image: 'https://via.placeholder.com/40'
    }
  ]);

  private ordersSource = new BehaviorSubject<any[]>([
    { id: 1, total: 29.99 },
    { id: 2, total: 49.99 }
  ]);



  users$ = this.usersSource.asObservable();
  products$ = this.productsSource.asObservable();
  orders$ = this.ordersSource.asObservable();

  getUsers() {
    return this.users$;
  }

  getProducts() {
    return this.products$;
  }

  getOrders() {
    return this.orders$;
  }


  addProduct(product: any) {
    const current = this.productsSource.value;

    const newProduct = {
      ...product,
      id: Date.now(),
      active: true,
      stock: product.stock || 0
    };

    this.productsSource.next([...current, newProduct]);
  }

  deleteProduct(id: number) {
    const updated = this.productsSource.value.filter(p => p.id !== id);
    this.productsSource.next(updated);
  }

  toggleProductStatus(id: number, active: boolean) {
    const updated = this.productsSource.value.map(p =>
      p.id === id ? { ...p, active } : p
    );

    this.productsSource.next(updated);
  }
}
