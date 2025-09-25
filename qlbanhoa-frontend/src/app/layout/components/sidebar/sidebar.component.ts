import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  // Hiển thị tất cả các mục quản lý
  nav: NavItem[] = [
    { label: 'Dashboard',        path: '/admin/dashboard' },
    { label: 'Products',         path: '/admin/products' },
    { label: 'Orders',           path: '/admin/orders', badge: '12' },
    { label: 'Customers',        path: '/admin/customers' },
    { label: 'Suppliers',        path: '/admin/suppliers' },
    { label: 'Purchase Orders',  path: '/admin/purchase-orders' },
    { label: 'Inventory',        path: '/admin/inventory' },
    { label: 'Reports & Analytics', path: '/admin/reports' },
    { label: 'Promotions',       path: '/admin/promotions' },
    { label: 'Shipping',         path: '/admin/shipping' },
    { label: 'Payments',         path: '/admin/payments' },
    { label: 'Users',            path: '/admin/users' },
    { label: 'Roles',            path: '/admin/roles' },
    { label: 'Permissions',      path: '/admin/permissions' },
    { label: 'Settings',         path: '/admin/settings' },
  ];
}
