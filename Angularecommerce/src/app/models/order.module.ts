export interface Order {
  id?: number; // Make optional
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  product_title: string;
  product_id: string;
  price: string;
  quantity: string;
  image: string;
  tracking_id?: string;
  delivery_status: string;
  payment_status: string;
  created_at?: string; // Make optional
  updated_at?: string; // Add if needed
}