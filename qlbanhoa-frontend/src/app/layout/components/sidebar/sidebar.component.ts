import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  path: string;
  badge?: string;
  permission?: string; // ✅ thêm thuộc tính permission
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  constructor(public auth: AuthService,private router: Router) { }

  // Danh sách menu + quyền tương ứng
  nav: NavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard' }, // không cần quyền
    { label: 'Products', path: '/admin/products', permission: 'product.read' },
    { label: 'Categories', path: '/admin/categories', permission: 'category.read' },
    { label: 'Orders', path: '/admin/orders', badge: '12', permission: 'order.read' },
    { label: 'Customers', path: '/admin/customers', permission: 'customer.read' },
    { label: 'Suppliers', path: '/admin/suppliers', permission: 'supplier.read' },
    { label: 'Purchase Orders', path: '/admin/purchase-orders', permission: 'purchase.read' },
    { label: 'Inventory', path: '/admin/inventory', permission: 'inventory.read' },
    { label: 'Reports & Analytics', path: '/admin/reports', permission: 'report.read' },
    { label: 'Promotions', path: '/admin/promotions', permission: 'promotion.read' },
    { label: 'Shipping', path: '/admin/shipping', permission: 'shipping.read' },
    { label: 'Payments', path: '/admin/payments', permission: 'payment.read' },
    { label: 'Users', path: '/admin/users', permission: 'user.read' },
    { label: 'Roles', path: '/admin/roles', permission: 'role.read' },
    { label: 'Permissions', path: '/admin/permissions', permission: 'permission.read' },
    { label: 'Settings', path: '/admin/settings', permission: 'setting.read' }
  ];

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadProfile().subscribe();
      console.log('Nav:', this.nav);
      console.log('User profile:', this.auth.getProfile());
    }
  }

  canAccess(item: any): boolean {
    const user = this.auth.getProfile();  // lấy profile từ AuthService
    if (!user) return false;

    // nếu không cấu hình roles thì cho phép luôn
    if (!item.roles || item.roles.length === 0) return true;

    // kiểm tra user.roles có giao với item.roles
    return user.roles.some((r: string) => item.roles.includes(r));
  }
logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
