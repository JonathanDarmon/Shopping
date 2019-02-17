import { CartData } from './cart-data.model';
import { CartDetails } from './cart-data.model';

export interface CartState {
  loaded: boolean;
  cartData: CartData[];
  cartDetails: CartDetails[];
  total_price: number;
}
