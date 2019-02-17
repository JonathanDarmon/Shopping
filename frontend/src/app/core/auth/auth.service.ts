import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Data } from '@angular/router';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthData } from './auth-data.model';
import { LoginData } from './login-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentName = new BehaviorSubject<string>('currentName');
  private fullName = new BehaviorSubject<string>('FullName');
  cast = this.currentName.asObservable();
  castFullName = this.fullName.asObservable();
  isAdmin = false;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(id: string, email: string, password: string, name: string, lastName: string, city: string, street: string) {
    const authData: AuthData = {
      id: id,
      email: email,
      password: password,
      name: name,
      lastName: lastName,
      city: city,
      street: street
    };
    this.http.post('http://localhost:3000/api/users/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  loginUser(email: string, password: string) {
    const loginData: LoginData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number, data: Data  }>('http://localhost:3000/api/users/login', loginData)
      .subscribe(response => {
        const userId = response.data._id;
        const fetchedUser = response.data;
        const token = response.token;
        this.token = token;
        const currentName = fetchedUser.name;
        const fullName = fetchedUser.name + ' ' + fetchedUser.lastName;
        const role = fetchedUser.role;
        if (role === 'admin') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, currentName, fullName, userId, role);
          location.reload();
          if (this.isAdmin === true) {
            this.router.navigate(['/administrator']);
          }
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      const currentName = authInformation.currentName;
      const fullName = authInformation.fullName;
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.currentName.next(currentName);
      this.fullName.next(fullName);
      this.authStatusListener.next(true);
      if (authInformation.role === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

  logoutUser() {
    this.currentName = null;
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number, ) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, currentName: string, fullName: string, userId: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('id', userId);
    localStorage.setItem('name', currentName);
    localStorage.setItem('fullname', fullName);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiration');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('fullname');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const expirationDate = localStorage.getItem('expiration');
    const currentName = localStorage.getItem('name');
    const fullname = localStorage.getItem('fullname');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      role: role,
      expirationDate: new Date(expirationDate),
      currentName: currentName,
      fullName: fullname
    };
  }
}
