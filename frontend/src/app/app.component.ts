import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/auth/auth.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
