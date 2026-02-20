import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { AdminDataService } from '../../../services/admin.data.service';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  image?: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  search = '';
  selectedCategory = 'all';
  sortBy: 'name' | 'price' | 'stock' = 'name';

  private search$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.adminData.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.products = data;
        this.applyFilters();
      });

    this.search$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters() {
    let result = [...this.products];

    if (this.search) {
      const term = this.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    result.sort((a, b) => {
      if (this.sortBy === 'name') return a.name.localeCompare(b.name);
      if (this.sortBy === 'price') return a.price - b.price;
      return b.stock - a.stock;
    });

    this.filteredProducts = result;
  }

  onSearchChange() {
    this.search$.next();
  }

  get categories() {
    return [...new Set(this.products.map(p => p.category))];
  }

  getStockPercent(stock: number) {
    const max = 100;
    return Math.min((stock / max) * 100, 100);
  }

  toggleStatus(product: Product) {
    const newStatus = !product.active;
    this.adminData.toggleProductStatus(product.id, newStatus);
  }

  openAdd() {
    alert('Add product modal (next step)');
  }

  editProduct(product: Product) {
    alert(`Edit product: ${product.name}`);
  }

  deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.adminData.deleteProduct(product.id);
  }
}


