import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartItem } from '../../models/cart.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  readonly baseImageUrl = 'http://localhost:8000/products_images'; // Direct URL
  cartItems: CartItem[] = [];
  total = 0;
  isLoading = true;
  error: string | null = null;
  userId = 1; // Hardcoded per requirements

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getCart(this.userId).pipe(
      catchError(error => {
        this.error = 'Failed to load cart';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.processCartResponse(response);
      }
      this.isLoading = false;
    });
  }

  private processCartResponse(response: any) {
    const items = Array.isArray(response) ? response : response.items;
    
    this.cartItems = items.map((item: { image: string; }) => ({
      ...item,
      image: this.getFullImageUrl(item.image),
      imageError: false
    }));
    
    this.total = this.calculateTotal(items);
  }

  private getFullImageUrl(imagePath: string): string {
    return `${this.baseImageUrl}/${imagePath}`;
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((acc, item) => 
      acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
  }

  handleImageError(event: Event, item: CartItem) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    item.imageError = true;
  }

  removeItem(cartId: number) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.apiService.removeFromCart(cartId).subscribe({
        next: () => this.loadCart(),
        error: () => alert('Failed to remove item')
      });
    }
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.apiService.clearCart(this.userId).subscribe({
        next: () => this.loadCart(),
        error: () => alert('Failed to clear cart')
      });
    }
  }

  navigateToCheckout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}