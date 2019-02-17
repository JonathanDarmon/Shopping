import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { ProductService } from '../../core/services/products.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})


export class AdministratorComponent implements OnInit {
  // Side-Nav toggle
  events: string[] = [];
  opened: boolean;

  products: any = [];
  selectedFile: File = null;

  constructor(public productService: ProductService, private http: HttpClient) { }


  onImagePicked(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onCreate(form: NgForm) {
    this.productService.createProduct(
      form.value.productName,
      form.value.productId,
      form.value.productPrice,
      form.value.productCategory,
      this.selectedFile
    );
    form.resetForm();
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
