import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },            

  // 👉 Khu vực admin
  {
    path: 'admin',
    loadChildren: () =>
      import('./layout/layout.module').then(m => m.LayoutModule)
  },

  // 👉 Trang Users (quản lý người dùng)
  {
    path: 'users',
    loadComponent: () =>
      import('./admin/user/users.component').then(m => m.UsersComponent)
  },

  { path: '**', redirectTo: 'login' }                    
];
