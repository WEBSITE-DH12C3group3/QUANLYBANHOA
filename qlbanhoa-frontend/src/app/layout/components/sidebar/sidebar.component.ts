import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  path: string;
  badge?: string;
  permission?: string; // ✅ quyền cần thiết để hiển thị menu
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  // Danh sách menu + quyền tương ứng
nav: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Products', path: '/admin/products', permission: 'product' },
  { label: 'Categories', path: '/admin/categories', permission: 'category' },
  { label: 'Orders', path: '/admin/orders', permission: 'order' },
  { label: 'Customers', path: '/admin/customers', permission: 'user' },
  { label: 'Suppliers', path: '/admin/suppliers', permission: 'supplier' },
  { label: 'Purchase Orders', path: '/admin/purchase-orders', permission: 'purchase' },
  { label: 'Reports & Analytics', path: '/admin/reports', permission: 'report' },
  { label: 'Promotions', path: '/admin/promotions', permission: 'promotion' },
  { label: 'Shipping', path: '/admin/shipping', permission: 'shipping' },
  { label: 'Users', path: '/admin/users', permission: 'user' },
  { label: 'Roles', path: '/admin/roles', permission: 'user' },
  { label: 'Permissions', path: '/admin/permissions', permission: 'user' },
  { label: 'Settings', path: '/admin/settings', permission: 'setting' }
];


  userPermissions: string[] = [];

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadProfile().subscribe(profile => {
        this.userPermissions = profile?.permissions || [];
        console.log('✅ User permissions:', this.userPermissions);
      });
    }
  }

  // ✅ kiểm tra quyền
  canAccess(item: NavItem): boolean {
    if (!item.permission) return true; // menu không cần quyền
    return this.userPermissions.includes(item.permission);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
