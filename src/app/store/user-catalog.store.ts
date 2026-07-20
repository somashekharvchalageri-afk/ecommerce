// src/app/store/user-catalog.store.ts
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Product } from '../services/cart.model';

// 1. Define what this piece of global state looks like
export interface CatalogState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  isLoading: false,
  error: null
};

// 2. Initialize the functional SignalStore
export const CatalogStore = signalStore(
  { providedIn: 'root' }, // Singleton access across components
  
  // Mixin A: Initialize the raw state
  withState(initialState),

  // Mixin B: Define calculated selectors (Computed Signals)
  withComputed(({ products }) => ({
    totalCatalogItems: computed(() => products().length),
    premiumProducts: computed(() => products().filter(p => p.price > 50))
  })),

  // Mixin C: Define public actions/methods (Handles Sync & Async data streams)
  withMethods((store, productService = inject(ProductService)) => ({
    
    // An Asynchronous RxJS manager tracking actions from your database connection
    loadAllProducts: rxMethod<void>(
      pipe(
        // Set loading flag cleanly to update UI spinners
        tap(() => patchState(store, { isLoading: true, error: null })),
        
        switchMap(() => 
          productService.getProducts().pipe(
            tap((products) => {
              // Update state atomically when the database responds
              patchState(store, { products, isLoading: false });
            }),
            catchError((err) => {
              patchState(store, { error: err.message, isLoading: false });
              return of([]);
            })
          )
        )
      )
    ),

    // NOTE: This placeholder method will directly target your custom backend database later
    addCustomDatabaseProduct(newProduct: Product) {
      patchState(store, (state) => ({
        products: [...state.products, newProduct]
      }));
    }
  }))
);
