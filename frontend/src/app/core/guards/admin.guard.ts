import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthAdmin = this.authService.isAdmin;
    if (isAuthAdmin) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

}
