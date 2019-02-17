import { Injectable, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Data } from '@angular/router';

import { OrderData } from '../models/order-data.model';
import { CartData, CartDetails } from '../models/cart-data.model';
import { CartState } from '../models/cartState';
import { Subject } from 'rxjs/Subject';
import { log } from 'util';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient, private router: Router) {}

  private cartSubject = new Subject<CartState>();
  private quantitySubject = new Subject<number>();
  user_cart: CartDetails[] = [];
  itemCart: CartData[] = [];
  totalPrice: number;
  CartState = this.cartSubject.asObservable();
  quantityState = this.quantitySubject.asObservable();


  showOrder(order_details, totalPrice, itemCart) {
    this.user_cart = order_details;
    this.itemCart = itemCart;
    this.totalPrice = totalPrice;
    this.cartSubject.next(<CartState>{
      loaded: false,
      cartData: this.itemCart,
      cartDetails: this.user_cart,
      total_price: this.totalPrice
    });
  }

  createOrder(order) {
    const newOrder: OrderData = {
      user_id: order.cartDetails[0].user_id,
      cart_id: order.cartDetails[0]._id,
      total_price: order.final_price,
      city: order.city,
      street: order.street,
      shipment_date: order.delivery_date,
      order_date: order.order_date,
      payment: order.payment
    };
    this.http.post<{message: string}>('http://localhost:3000/api/orders/create', newOrder)
    .subscribe(response => {
      localStorage.removeItem('cart-id');
    });
    }

    getOrders() {
      return this.http.get<{orders: Data}>('http://localhost:3000/api/orders');
    }

    getDate(user_id) {
      const id = user_id;
      return this.http.get<{date: Date}>(`http://localhost:3000/api/orders/${id}`);
    }

  getCart() {
    return [...this.user_cart];
  }

  getProducts() {
    return [...this.itemCart];
  }

  getTotalPrice() {
    return this.totalPrice;
  }

}

