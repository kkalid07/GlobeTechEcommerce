import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartItem } from '../../models/cart.model';
import { Order } from '../../models/order.module';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  cartItems: CartItem[] = [];
  userId = 1; // Hardcoded per requirements
  isLoading = true;
  total = 0;

  constructor() {
    this.apiService.getCart(this.userId).subscribe({
      next: (cart: any) => {
        // Handle array response from Laravel
        this.cartItems = Array.isArray(cart) ? cart : cart.items;
        this.total = this.calculateTotal();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  private calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => 
      acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
  }

submitOrder() {
  if (this.checkoutForm.invalid) return;

  const orderRequests = this.cartItems.map(item => {
    const orderData: Order = {
      user_id: this.userId.toString(),
      name: this.checkoutForm.value.name || '',
      email: this.checkoutForm.value.email || '',
      phone: this.checkoutForm.value.phone || '',
      address: this.checkoutForm.value.address || '',
      product_title: item.product_title,
      product_id: item.product_id,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      delivery_status: 'processing',
      payment_status: 'pending'
    };

    return this.apiService.createOrder(orderData);
  });

  forkJoin(orderRequests).subscribe({
    next: () => {
      this.apiService.clearCart(this.userId).subscribe();
      this.router.navigate(['/orders']);
    },
    error: () => alert('Failed to create orders')
  });
}
}