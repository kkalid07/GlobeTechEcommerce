import { Product } from "./product.model";

export interface CartItem {
  imageError: boolean;
  id: number;
  user_id: string;
  product_id: string;
  quantity: string;
  product_title: string;
  price: string;
  image: string;
  product?: Product; // Optional product details
}

export interface Cart {
  items: CartItem[];
  total: number;
}