import { Component, OnInit, OnDestroy, Input, SimpleChange } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import { CartService } from '../../core/services/cart.service';
import { CartState } from '../../core/models/cartState';
import { CartData, CartDetails } from '../../core/models/cart-data.model';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { EventEmitter } from 'events';
import { OrderService } from 'src/app/core/services/orders.service';
import { Router, Data } from '@angular/router';
import { errorHandler } from '@angular/platform-browser/src/browser';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
@Input() cartItem: CartData[];
@Input() cartDetails: CartDetails[];
@Input() totalPrice: number;
  loaded = true;
  private subscription: Subscription;
  constructor(private cartService: CartService, private orderService: OrderService, private router: Router,
     private snackBar: MatSnackBar) { }

  onOrder() {
    if (this.cartItem) {
      const cart_details = this.cartDetails;
    const cart_item = this.cartItem;
    this.orderService.showOrder(cart_details, this.totalPrice, cart_item);
    this.router.navigate(['/order']);
    } else {
      const snackBarRef = this.snackBar.open('Cart is empty!', 'Undo', {
        duration: 3000
      });
    }

  }

  removeItem(product) {
     this.cartItem.forEach( (item, index) => {
       if (item.product_id === product.product_id) {
         return this.cartItem.splice(index, 1);
        }
      });
      const product_id = product.product_id;
      this.totalPrice -= product.total;
      this.cartService.itemRemove(product_id);
  }

  clearCart() {
    this.cartItem = [];
    this.totalPrice = 0;
    this.cartService.clearCurrentCart();
  }

  ngOnInit() {
    this.cartService.getActiveCart();
    this.subscription = this.cartService.CartState
    .subscribe((state: CartState) => {
      this.cartItem = state.cartData;
      this.totalPrice = state.total_price;

      if (!this.cartDetails) {
        this.cartDetails = state.cartDetails;
      }
    });

  }

  ngOnDestroy() {

  }




}
