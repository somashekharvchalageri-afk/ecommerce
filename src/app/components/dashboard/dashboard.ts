import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/cart.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CatalogStore } from '../../store/user-catalog.store';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CurrencyPipe, RouterLink, JsonPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor() {
    console.log('Dashboard component initialized');
  }
  protected readonly cartStore = inject(CartService);
  protected readonly totalCount = this.cartStore.totalItemsCount;
  protected readonly productService = inject(ProductService);
  protected readonly store = inject(CatalogStore);

  // Static mock product array for display
  // protected readonly products: Product[] = [
  //   { id: 101, title: 'India Gate Basmati Rice', price: 29.99, image: '' },
  //   { id: 102, title: 'Indian cottage cheese', price: 9.99, image: '' },
  //   { id: 103, title: 'Toor Dal 1 kg', price: 4.99, image: '' },
  //   { id: 104, title: 'Garam Masala', price: 5.99, image: '' }
  // ];

  protected readonly products = toSignal(this.productService.getProducts(), { initialValue: undefined });

  // getProducts () {
  //   console.log(this.products());
  //   return this.products();
  // }

  ngOnInit(): void {
    // Fire off the asynchronous call when the user lands on the dashboard page
    this.store.loadAllProducts();
  }
}
