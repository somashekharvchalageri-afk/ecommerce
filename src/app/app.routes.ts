import { Routes } from '@angular/router';
import { CartSummary } from './components/cart-summary/cart-summary';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Dashboard }, 
  { path: 'checkout', component: CartSummary},
  { path: '**', redirectTo: '' }
];
