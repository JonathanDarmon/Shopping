import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../../core/services/products.service';
import { OrderService } from '../../core/services/orders.service';
import { CartService } from 'src/app/core/services/cart.service';
import { parseTimelineCommand } from '@angular/animations/browser/src/render/shared';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  color = 'AliceBlue';
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  fullName: string = null;
  products: any = [];
  countOrders: number;
  activeCart: boolean;
  user_id: string;
  noOrder: boolean;
  orderDate: any;
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    public productService: ProductService,
    private cartService: CartService
    ) { }

  ngOnInit() {
    this.user_id = localStorage.getItem('id');
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.castFullName.subscribe(fullName => {
      this.fullName = fullName;
    });
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    // available products length
    this.productService.getProducts()
    .subscribe(data => {
      this.products = data.products
      .map(function(products) {
        return products;
      });
    });
    // Amount of orders subbmited
    this.orderService.getOrders()
    .subscribe(orders => {
      this.countOrders = orders['count'];
    });
    // last order date
    this.orderService.getDate(this.user_id)
    .subscribe(date => {
      if (date === null) {
        this.noOrder = false;
      } else {
        this.noOrder = true;
        const orderDate = date.date;
        const newDate = new Date(orderDate);
        const displayDate = newDate.getDate() + '-' + (newDate.getMonth() + 1 ) + '-' + newDate.getFullYear();
        this.orderDate = displayDate;
      }
    });
    this.activeCart = this.cartService.getActiveCart();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
