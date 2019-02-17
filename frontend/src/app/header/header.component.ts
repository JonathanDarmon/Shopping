import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
@Injectable({ providedIn: 'root' })
export class HeaderComponent implements OnInit, OnDestroy {
  public userIsAuthenticated = false;
  public adminAuth = false;
  private authListenerSubs: Subscription;
  color = 'bluelight';
  currentName: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authService.cast.subscribe(currentName => {
      this.currentName = currentName;
    });
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.adminAuth = this.authService.isAdmin;
  }

  onLogout() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
