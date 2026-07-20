import { computed, Injectable, signal } from '@angular/core';
import { CartItem, CartState, Product } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private state = signal<CartState>({
    items: [],
    shippingCost: 0,
    promoCode: null,
  });

  readonly items = computed(() => this.state().items);
  readonly shippingCost = computed(()=> this.state().shippingCost);
  readonly promoCode = computed(()=> this.state().promoCode);

  readonly totalItemsCount = computed(()=> 
    this.state().items.reduce((total, item) => total + item.quantity, 0));

  readonly subTotal = computed(()=> 
    this.state().items.reduce((total, item)=> total + (item.product.price * item.quantity), 0));

  readonly discount = computed(() =>
    this.promoCode() === 'SAVE10' ? this.subTotal() * 0.10 : 0
  );

  readonly grandTotal = computed(() => {
      const total = this.subTotal() - this.discount();
      return total > 0 ? total + this.shippingCost() : 0;
    }
  );

  addToCart(product: Product): void {
    this.state.update((current) => {
      const existingIndex = current.items.findIndex(item => item.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = current.items.map((item, index) => 
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...current.items, { product, quantity: 1 }];
      }
      return { ...current, items: updatedItems };
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.state.update((current) => ({
      ...current,
      items: current.items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  }

  removeFromCart(productId: number): void {
    this.state.update((current) => ({
      ...current,
      items: current.items.filter(item => item.product.id !== productId)
    }));
  }

  applyPromoCode(code: string): void {
    this.state.update((current) => ({ ...current, promoCode: code }));
  }

}
