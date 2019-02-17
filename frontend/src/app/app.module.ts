import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatGridListModule,
  MatFormFieldModule,
  MatIconModule,
  MatStepperModule,
  MatListModule,
  MatSelectModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatSidenavModule
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';



import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainPageComponent } from './body/main-page/main-page.component';
import { RegisterComponent } from './body/register/register.component';
import { ShoppingComponent } from './body/shopping/shopping.component';
import { OrderComponent } from './body/order/order.component';
import { LoginComponent } from './body/main-page/login/login.component';
import { AuthInterceptor } from './core/auth/auth-interceptor';
import { AdministratorComponent } from './body/administrator/administrator.component';
import { CartComponent } from './body/cart/cart.component';
import { DialogContent  } from './body/order/order.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainPageComponent,
    RegisterComponent,
    ShoppingComponent,
    OrderComponent,
    LoginComponent,
    AdministratorComponent,
    CartComponent,
    DialogContent,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatStepperModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    AppRoutingModule,
    Ng2SearchPipeModule
  ],
  entryComponents: [
    DialogContent,
    ErrorComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
