import { CartDetails } from './cart-data.model';

export interface OrderData {
  user_id: string;
  cart_id: string;
  total_price: number;
  city: string;
  street: string;
  shipment_date: string;
  order_date: string;
  payment: number;
}
