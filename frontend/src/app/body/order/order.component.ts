import { Component, OnInit, Input, inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import { CartData, CartDetails } from '../../core/models/cart-data.model';

import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { OrderService } from 'src/app/core/services/orders.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private subscription: Subscription;

  constructor(private orderService: OrderService, public dialog: MatDialog, private router: Router) { }
  @Input() cartItem: CartData[] = [];
  @Input() cartDetails: CartDetails[];
  @Input() totalPrice: number;
  loaded = true;

  onOrder(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const now = new Date();
    const cart_Date = new Date(now.getTime());
    const order = {
      cartDetails: this.cartDetails,
      final_price: this.totalPrice,
      city: form.value.city,
      street: form.value.street,
      delivery_date: form.value.shippingDate,
      order_date: cart_Date.toISOString(),
      payment: form.value.creditCard
    };
    this.openDialog();
    this.orderService.createOrder(order);
  }

  openDialog() {
// tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DialogContent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
    });
  }

  ngOnInit() {
    this.cartDetails = this.orderService.getCart();
    this.cartItem = this.orderService.getProducts();
    this.totalPrice = this.orderService.getTotalPrice();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogContent {
 constructor (private orderService: OrderService) {}
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };
  user_cart: any[] = [];

  ValidateOrderData() {
    return of({
      userDate1: 1,
      userData2: 2
    });
  }

  passReceipt(user_cart) {

  }
  private downloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  downloadTxt() {
      this.ValidateOrderData().subscribe((res) => {
        this.downloadByHtmlTag({
          fileName: 'Receipt',
          text: JSON.stringify(res)
        });
      });
  }


}
