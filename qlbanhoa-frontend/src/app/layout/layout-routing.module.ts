import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { FeaturePlaceholderComponent } from '../../app/features/feature-placeholder.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: FeaturePlaceholderComponent, data: { title: 'Dashboard', requiredPerm: null } },

      {
        path: 'products',
        loadComponent: () =>
          import('../features/admin/products/components/product-list/product-list.component')
            .then(m => m.ProductListComponent),
        data: { title: 'Products', requiredPerm: 'product.read' }
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('../features/admin/products/components/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
        data: { title: 'Create Product', requiredPerm: 'product.write' }
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('../features/admin/products/components/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
        data: { title: 'Edit Product', requiredPerm: 'product.write' }
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('../features/admin/categories/components/category-list/category-list.component')
            .then(m => m.CategoryListComponent),
        data: { title: 'Categories', requiredPerm: 'product.read' }
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('../features/admin/categories/components/category-form/category-form.component')
            .then(m => m.CategoryFormComponent),
        data: { title: 'New Category', requiredPerm: 'product.write' }
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import('../features/admin/categories/components/category-form/category-form.component')
            .then(m => m.CategoryFormComponent),
        data: { title: 'Edit Category', requiredPerm: 'product.write' }
      },

      {
        path: 'purchase-orders',
        loadComponent: () =>
          import('../features/admin/purchase/components/po-list/po-list.component')
            .then(m => m.PoListComponent),
        data: { title: 'Purchase Orders', requiredPerm: 'order.read' }
      },
      {
        path: 'purchase-orders/new',
        loadComponent: () =>
          import('../features/admin/purchase/components/po-form/po-form.component')
            .then(m => m.PoFormComponent),
        data: { title: 'New Purchase Order', requiredPerm: 'order.write' }
      },
      {
        path: 'purchase-orders/:id',
        loadComponent: () =>
          import('../features/admin/purchase/components/po-form/po-form.component')
            .then(m => m.PoFormComponent),
        data: { title: 'Purchase Order Detail', requiredPerm: 'order.read' }
      },

      { path: 'orders', component: FeaturePlaceholderComponent, data: { title: 'Orders', requiredPerm: 'order.read' } },
      { path: 'customers', component: FeaturePlaceholderComponent, data: { title: 'Customers', requiredPerm: 'user.read' } },

      {
        path: 'suppliers',
        loadComponent: () =>
          import('../features/admin/suppliers/components/supplier-list/supplier-list.component')
            .then(m => m.SupplierListComponent),
        data: { title: 'Suppliers', requiredPerm: 'product.read' }
      },
      {
        path: 'suppliers/new',
        loadComponent: () =>
          import('../features/admin/suppliers/components/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent),
        data: { title: 'New Supplier', requiredPerm: 'product.write' }
      },
      {
        path: 'suppliers/:id',
        loadComponent: () =>
          import('../features/admin/suppliers/components/supplier-form/supplier-form.component')
            .then(m => m.SupplierFormComponent),
        data: { title: 'Edit Supplier', requiredPerm: 'product.write' }
      },
      {
        path: 'users',
        loadComponent: () => import('../admin/user/users-list.component')
          .then(m => m.UsersListComponent),
        data: { title: 'Users' }
      },
      {
        path: 'users/new',
        loadComponent: () => import('../admin/user/user-form.component')
          .then(m => m.UserFormComponent),
        data: { title: 'Thêm User' }
      },
      {
        path: 'users/:id',
        loadComponent: () => import('../admin/user/user-form.component')
          .then(m => m.UserFormComponent),
        data: { title: 'Sửa User' }
      },
      {
        path: 'roles',
        loadComponent: () => import('../admin/role/roles-list.component')
          .then(m => m.RolesListComponent),
        data: { title: 'Roles' }
      },
      {
        path: 'roles/new',
        loadComponent: () => import('../admin/role/role-form.component')
          .then(m => m.RoleFormComponent),
        data: { title: 'Thêm Role' }
      },
      {
        path: 'roles/:id',
        loadComponent: () => import('../admin/role/role-form.component')
          .then(m => m.RoleFormComponent),
        data: { title: 'Sửa Role' }
      },
      {
        path: 'permissions',
        loadComponent: () => import('../admin/permisison/permissions-list.component')
          .then(m => m.PermissionsListComponent),
        data: { title: 'Permissions' }
      },
      {
        path: 'permissions/new',
        loadComponent: () => import('../admin/permisison/permission-form.component')
          .then(m => m.PermissionFormComponent),
        data: { title: 'Thêm Permission' }
      },
      {
        path: 'permissions/:id',
        loadComponent: () => import('../admin/permisison/permission-form.component')
          .then(m => m.PermissionFormComponent),
        data: { title: 'Sửa Permission' }
      },



      { path: 'settings', component: FeaturePlaceholderComponent, data: { title: 'Settings', requiredPerm: 'user.write' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
