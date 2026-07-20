import { Component, inject, signal } from '@angular/core';
import { CartService } from './services/cart.service';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor() {
    console.log('App component initialized');
  } 
  protected readonly title = signal('Indian Store');
  private cartStore = inject(CartService);
  private mockIdCounter = 1;

  addMockProduct() {
    this.cartStore.addToCart({
      id: this.mockIdCounter,
      title: `E-commerce Product #${this.mockIdCounter}`,
      price: Math.floor(Math.random() * 40) + 10, // Random price between 10 and 50
      image: ''
    });
    this.mockIdCounter++;
  }
}
