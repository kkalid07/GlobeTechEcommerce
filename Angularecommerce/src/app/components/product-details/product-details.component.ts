import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  product$!: Observable<Product | undefined>;
  baseImageUrl = 'http://localhost:8000/products_images'; // Same as in service
  isLoading = true;
  error: string | null = null;
  selectedQuantity: number = 1;
  //image handler
  imageError = false;
  enableZoom = true; // Set to false if you don't want zoom
  isZooming = false;
  zoomPosition = { x: 0, y: 0 };

  handleImageError(event: Event) {
    this.imageError = true;
    this.enableZoom = false;
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onMouseMove(event: MouseEvent) {
    if (!this.enableZoom || this.imageError) return;
    
    const imgElement = event.currentTarget as HTMLElement;
    const { left, top, width, height } = imgElement.getBoundingClientRect();
    
    this.zoomPosition = {
      x: event.clientX - left + 20, // 20px offset from cursor
      y: event.clientY - top + 20
    };
  }

  toggleZoom(zooming: boolean) {
    if (!this.enableZoom || this.imageError) return;
    this.isZooming = zooming;
  }
  
  constructor() {
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      this.product$ = this.apiService.getProduct(+productId).pipe(
        map(product => ({
          ...product,
          image: `${this.baseImageUrl}/${product.image}` // Transform here
        })),
        catchError(error => {
          this.error = 'Failed to load product details';
          return of(undefined);
        })
      );
    }
  }

  addToCart(productId: number) {
  const userId = 1; // Hardcoded user ID
  
  this.apiService.addToCart(productId, userId).subscribe({
    next: () => {
      alert('Product added to cart!');
      this.router.navigate(['/cart']);
    },
    error: (error) => {
      console.error('Cart error:', error);
      alert('Failed to add product to cart');
    }
  });
}
}