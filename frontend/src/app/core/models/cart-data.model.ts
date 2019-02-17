export interface CartDetails {
  cart_id: string;
  user_id: string;
  cart_date: string;
  cart_data: Array<CartData>;
  activeCart: boolean;
}

export interface CartData {
  product_name: string;
  product_id: number;
  product_price: number;
  product_image: string;
  product_quantity: number;
  total: number;
}
