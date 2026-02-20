import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { ShopComponent } from './shop/shop';
import { CartComponent } from './cart/cart';
import { LoginComponent } from './auth/login/login';
import { ProfileComponent } from './profile/profile';
import { AdminComponent } from './admin/admin';
import { ToyComponent } from './toy/toy';
import { ReservationComponent } from './reservation/reservation';
import { AboutComponent } from './about/about';
import { CheckoutComponent } from './checkout/checkout';
import { AdminGuardService } from '../services/admin.guard.service';
import { SignupComponent } from './auth/signup/signup';

import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'shop', component: ShopComponent },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'reserve', component: ReservationComponent, canActivate: [authGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./admin/products/products').then(m => m.ProductsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users').then(m => m.UsersComponent)
      },
      {
        path: 'reserve',
        component: ReservationComponent
      }
    ]
  },

  { path: 'toy/:id', component: ToyComponent },
  { path: 'about', component: AboutComponent },

  { path: '**', redirectTo: '' }
];
