import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './body/main-page/main-page.component';
import { RegisterComponent } from './body/register/register.component';
import { ShoppingComponent } from './body/shopping/shopping.component';
import { AdministratorComponent } from './body/administrator/administrator.component';
import { OrderComponent } from './body/order/order.component';

import { AuthGuard } from '././core/guards/auth.guard';
import { AdminGuard } from '././core/guards/admin.guard';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'shopping', component: ShoppingComponent, canActivate: [ AuthGuard ]},
  {path: 'order', component: OrderComponent, canActivate: [ AuthGuard ]},
  {path: 'administrator', component: AdministratorComponent, canActivate: [ AuthGuard, AdminGuard]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ AuthGuard, AdminGuard ]
})
export class AppRoutingModule { }
