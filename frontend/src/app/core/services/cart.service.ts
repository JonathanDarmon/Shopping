import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Data } from '@angular/router';

import { CartData, CartDetails } from '../models/cart-data.model';
import { CartState } from '../models/cartState';
import { Subject } from 'rxjs/Subject';
import { empty, Subscriber } from 'rxjs';
import { ProductData } from '../models/product-data.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  private cartSubject = new Subject<CartState>();
  CartState = this.cartSubject.asObservable();

  user_cart: CartDetails[] = [];
  item_Cart: CartData[] = [];
  totalPrice: number;
  generatedId: string;
  activeCart: boolean;

  createCart(
    product_id: number,
    product_name: string,
    product_price: number,
    product_image: string,
    quantity: number,
    cart_Date: string
  ) {
    const item: CartData = {
      product_id: product_id,
      product_name: product_name,
      product_price: product_price,
      product_image: product_image,
      product_quantity: quantity,
      total: quantity * product_price
    };
    // update total price
    if (this.totalPrice === undefined) {
      this.totalPrice = item.total;
    }

    // If no existed cart, create one
    if (this.user_cart.length === 0) {
      this.item_Cart.push(item);
      const user_cart: CartDetails = {
        cart_id: null,
        user_id: localStorage.getItem('id'),
        cart_date: cart_Date,
        cart_data: this.item_Cart,
        activeCart: true
      };
      this.activeCart = true;
      this.createNewCart(user_cart);
    } else {
      this.updateExistingCart(item);
    }
  }


  // Create new cart
  createNewCart(user_cart: CartDetails) {
    this.user_cart.push(user_cart);
    this.http
      .post<{ message: string; cart: Data }>(
        'http://localhost:3000/api/shopping-cart/create',
        user_cart
      )
      .subscribe(response => {
        const generatedId = response.cart._id;
        this.generatedId = generatedId;
        localStorage.setItem('cart-id', generatedId);
        this.user_cart.find(
          cart => cart.cart_id === null
        ).cart_id = generatedId;
        this.cartSubject.next(<CartState>{
          loaded: false,
          cartData: this.item_Cart,
          cartDetails: this.user_cart,
          total_price: this.totalPrice
        });
      });
  }

  // Update existing cart
  updateExistingCart(item) {
    const newItem: CartData = {
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image: item.product_image,
      product_quantity: item.product_quantity,
      total: item.product_quantity * item.product_price
    };
    const itemId = item.product_id;
    const itemExist = this.item_Cart.some((items) => items.product_id === itemId);

    if (itemExist === true) {
      this.item_Cart.find((items, index) => {
        if (items.product_id === itemId) {
          return this.item_Cart[index].product_quantity += item.product_quantity;
        }
      });

      this.item_Cart.find((items, index) => {
        if (items.product_id === itemId) {
          return this.item_Cart[index].total += item.total;
        }
      });

    } else {
      this.item_Cart.push(newItem);
    }

    this.priceCounter();

    this.cartSubject.next(<CartState>{
      loaded: false,
      cartData: this.item_Cart,
      total_price: this.totalPrice
    });

    const id = localStorage.getItem('cart-id');
    this.http.post(`http://localhost:3000/api/shopping-cart/${id}`, newItem)
    .subscribe(response => {
    });
  }

  getActiveCart() {
    this.getCart().subscribe(data => {
      if (data) {
        const cartDetails = data['cart_details'];
        this.user_cart.push(cartDetails);
        this.item_Cart = data['products'].map(products => {
          return products;
        });

        this.item_Cart.forEach((item, index) => {
          const total = item.product_price * item.product_quantity;
          Object.defineProperty(this.item_Cart[index], 'total', {value: total, writable: true});
        });
        this.priceCounter();

        this.cartSubject.next(<CartState>{
          loaded: false,
          cartData: this.item_Cart,
          cartDetails: this.user_cart,
          total_price: this.totalPrice
        });
      } else {
        return this.activeCart = false;
      }
    });
  }

  getCart() {
    const user = localStorage.getItem('id');
    return this.http.get<{ items: CartData[], user_cart: CartData[] }>(`http://localhost:3000/api/shopping-cart/${user}`);
  }

  itemRemove(product_id) {
    this.priceCounter();

    const userId = localStorage.getItem('id');
    const prodId = product_id;
    this.http.delete(`http://localhost:3000/api/shopping-cart/${userId}/${prodId}`)
    .subscribe(response => {
    });
  }

  clearCurrentCart() {
    this.item_Cart = [];
    this.totalPrice = 0;
  }

  priceCounter() {
    this.totalPrice = 0;
    this.item_Cart.forEach((item, index) => {
      let sum;
      sum = item.total;
      return (this.totalPrice += sum);
    });
  }
}
