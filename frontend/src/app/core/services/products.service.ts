import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ProductData } from '../models/product-data.model';



@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private http: HttpClient, private router: Router) { }

  getProducts() {
    return this.http.get<{ products: ProductData[] }>('http://localhost:3000/api/products');
  }

  createProduct(productName: string, productId: string, productPrice: string, productCategory: string, productImage: File) {
    const productData = new FormData();
    productData.append('product_name', productName);
    productData.append('product_id', productId);
    productData.append('product_price', productPrice);
    productData.append('category_id', productCategory);
    productData.append('product_image', productImage, productName);
    this.http.post('http://localhost:3000/api/products/create', productData)
      .subscribe(response => {
        setInterval(function () { alert(response[0]);
        }, 3000);
        location.reload();
      });
  }


  filterCategory(category_id) {
    const c_id = category_id;
    return this.http.get<{ products: ProductData[] }>(`http://localhost:3000/api/products/${c_id}`);
  }
}
