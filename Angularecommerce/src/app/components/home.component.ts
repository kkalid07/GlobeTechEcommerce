import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Observable, catchError, of } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products$: Observable<Product[]>;
  isLoading = true;
  error: string | null = null;
  imageError = false;


  constructor(private apiService: ApiService) {
    this.products$ = this.apiService.getProducts().pipe(
      catchError(error => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        return of([]);
      })
    );

    this.products$.subscribe(() => {
      this.isLoading = false;
    });
  }

  handleImageError(event: Event) {
  this.imageError = true;
  (event.target as HTMLImageElement).style.display = 'none';
}
}