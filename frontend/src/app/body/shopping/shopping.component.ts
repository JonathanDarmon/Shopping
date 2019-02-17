import { Component, OnInit, Input } from '@angular/core';

import { ProductService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';

import { ProductData } from '../../core/models/product-data.model';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  @Input()products = [];

  events: string[] = [];
  opened: boolean;


  constructor(public productService: ProductService, public cartService: CartService) { }

  onAdd(product: ProductData) {
    const now = new Date();
    const cart_Date = new Date(now.getTime());
    const quantity =  1;
    this.cartService.createCart(
      product.product_id,
      product.product_name,
      product.product_price,
      product.product_image,
      quantity,
      cart_Date.toISOString()
    );
  }

  getAll() {
    this.products = [];
    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.products
          .map(function(products) {
            return products;
          });
      });
  }

  category(categoryId) {
    this.productService.filterCategory(categoryId).subscribe( data => {
      this.products = [];
      this.products = data.products
      .map(function(products) {
        return products;
      });
    });
  }
  ngOnInit() {
    this.productService.getProducts()
      .subscribe(data => {
        this.products = data.products
          .map(function(products) {
            return products;
          });
      });
  }
}



