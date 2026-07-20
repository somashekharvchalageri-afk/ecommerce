import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart-summary',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.scss',
})
export class CartSummary {
  protected readonly cartStore = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  protected readonly cartItems = this.cartStore.items;
  protected readonly totalCount = this.cartStore.totalItemsCount;
  protected readonly subtotal = this.cartStore.subTotal;
  protected readonly discount = this.cartStore.discount;
  protected readonly shipping = this.cartStore.shippingCost;
  protected readonly total = this.cartStore.grandTotal;

  placeOrder() {
    if (isPlatformBrowser(this.platformId)) {
      alert('Order placed successfully!');
    }
  }
}
