import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  cartCount = 0;
  animate = false;

  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.refreshAuthState();
      });

    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
      this.animate = true;

      setTimeout(() => {
        this.animate = false;
      }, 250);
    });

    this.refreshAuthState();
  }

  refreshAuthState() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.isAdmin = this.auth.isAdmin();
  }

  logout() {
    this.auth.logout();
    this.refreshAuthState();
    this.router.navigate(['/login']);
  }
}
