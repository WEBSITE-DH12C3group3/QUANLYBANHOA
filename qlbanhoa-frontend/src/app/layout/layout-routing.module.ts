import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { FeaturePlaceholderComponent } from '../../app/features/feature-placeholder.component';
import { UsersComponent } from '../admin/user/users.component';
import { RolesComponent } from '../admin/role/roles.component';
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: FeaturePlaceholderComponent, data: { title: 'Dashboard' } },
      { path: 'products', component: FeaturePlaceholderComponent, data: { title: 'Products' } },
      { path: 'orders', component: FeaturePlaceholderComponent, data: { title: 'Orders' } },
      { path: 'customers', component: FeaturePlaceholderComponent, data: { title: 'Customers' } },
      { path: 'suppliers', component: FeaturePlaceholderComponent, data: { title: 'Suppliers' } },
      { path: 'purchase-orders', component: FeaturePlaceholderComponent, data: { title: 'Purchase Orders' } },
      { path: 'inventory', component: FeaturePlaceholderComponent, data: { title: 'Inventory' } },
      { path: 'reports', component: FeaturePlaceholderComponent, data: { title: 'Reports & Analytics' } },
      { path: 'promotions', component: FeaturePlaceholderComponent, data: { title: 'Promotions' } },
      { path: 'shipping', component: FeaturePlaceholderComponent, data: { title: 'Shipping' } },
      { path: 'payments', component: FeaturePlaceholderComponent, data: { title: 'Payments' } },
      { path: 'users', component: UsersComponent, data: { title: 'Users' } },
      { path: 'roles', component: RolesComponent, data: { title: 'Roles' } },
      { path: 'permissions', component: FeaturePlaceholderComponent, data: { title: 'Permissions' } },
      { path: 'settings', component: FeaturePlaceholderComponent, data: { title: 'Settings' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
