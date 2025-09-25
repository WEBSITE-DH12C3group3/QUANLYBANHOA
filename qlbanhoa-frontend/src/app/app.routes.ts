import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // 👈 mặc định vào login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },            // 👈 nếu sau khi login muốn vào home
  {
    path: 'admin',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  { path: '**', redirectTo: 'login' }                    // 👈 wildcard redirect
];
