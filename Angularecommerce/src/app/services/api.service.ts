import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product,  } from '../models/product.model';
import {  CartItem, Cart } from '../models/cart.model';
import { Order } from '../models/order.module';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; // Update if your Laravel API is on different port
  private baseImageUrl = 'http://localhost:8000/products_images'; // Direct image access


  constructor(private http: HttpClient) { }
   // Helper method to construct image URLs
  private getProductImageUrl(imagePath: string): string {
    return `${this.baseImageUrl}/${imagePath}`;
  }
  // Product endpoints
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(product => ({
        ...product,
        image: this.getProductImageUrl(product.image) // Transform image paths
      }))
    ));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/search/${query}`);
  }

  // Cart endpoints
 addToCart(productId: number, userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/cart/add/${productId}`, {
    user_id: userId.toString(),  // Convert to string
    quantity: 1  // Keep as number for validation
  });
}

  getCart(userId: number): Observable<Cart> {
  return this.http.get<Cart>(`${this.apiUrl}/cart/${userId}`);
}

  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${cartId}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear/${userId}`);
  }

  // Order endpoints
 createOrder(orderData: Omit<Order, 'id'|'created_at'>): Observable<Order> {
  return this.http.post<Order>(`${this.apiUrl}/orders/create`, orderData);
}

  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/cancel/${orderId}`, {});
  }
}