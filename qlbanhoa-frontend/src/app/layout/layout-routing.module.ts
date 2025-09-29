import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { FeaturePlaceholderComponent } from '../../app/features/feature-placeholder.component';
import { UsersComponent } from '../admin/user/users.component';
import { RolesComponent } from '../admin/role/roles.component';
import { PermissionsComponent } from '../admin/permisison/permissions.component';
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: FeaturePlaceholderComponent, data: { title: 'Dashboard' } },
      { path: 'products',
      loadComponent: () => import('../features/admin/products/components/product-list/product-list.component')
                        .then(m => m.ProductListComponent),
      data: { title: 'Products' }
      },
      { path: 'products/new',
      loadComponent: () => import('../features/admin/products/components/product-form/product-form.component')
                        .then(m => m.ProductFormComponent),
      data: { title: 'Create Product' }
      },
      { path: 'products/:id/edit',
      loadComponent: () => import('../features/admin/products/components/product-form/product-form.component')
                        .then(m => m.ProductFormComponent),
      data: { title: 'Edit Product' }
      },
      { path: 'categories',
      loadComponent: () =>
      import('../features/admin/categories/components/category-list/category-list.component')
      .then(m => m.CategoryListComponent),
      data: { title: 'Categories' }
      },
      { path: 'categories/new',
      loadComponent: () =>
      import('../features/admin/categories/components/category-form/category-form.component')
      .then(m => m.CategoryFormComponent),
      data: { title: 'New Category' }
      },
      { path: 'categories/:id',
      loadComponent: () =>
      import('../features/admin/categories/components/category-form/category-form.component')
      .then(m => m.CategoryFormComponent),
      data: { title: 'Edit Category' }
      },
      { path: 'purchase-orders',
      loadComponent: () => import('../features/admin/purchase/components/po-list/po-list.component').then(m => m.PoListComponent),
      data: { title: 'Purchase Orders' }
      },
      { path: 'purchase-orders/new',
      loadComponent: () => import('../features/admin/purchase/components/po-form/po-form.component').then(m => m.PoFormComponent),
      data: { title: 'New Purchase Order' }
      },
      { path: 'purchase-orders/:id',
      loadComponent: () => import('../features/admin/purchase/components/po-form/po-form.component').then(m => m.PoFormComponent),
      data: { title: 'Purchase Order Detail' }
      },


      { path: 'orders', component: FeaturePlaceholderComponent, data: { title: 'Orders' } },
      { path: 'customers', component: FeaturePlaceholderComponent, data: { title: 'Customers' } },
      { path: 'suppliers',
      loadComponent: () => import('../features/admin/suppliers/components/supplier-list/supplier-list.component').then(m => m.SupplierListComponent),
      data: { title: 'Suppliers' }
      },
      { path: 'suppliers/new',
      loadComponent: () => import('../features/admin/suppliers/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
      data: { title: 'New Supplier' }
      },
      { path: 'suppliers/:id',
      loadComponent: () => import('../features/admin/suppliers/components/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent),
      data: { title: 'Edit Supplier' }
      },

      { path: 'inventory', component: FeaturePlaceholderComponent, data: { title: 'Inventory' } },
      { path: 'reports', component: FeaturePlaceholderComponent, data: { title: 'Reports & Analytics' } },
      { path: 'promotions', component: FeaturePlaceholderComponent, data: { title: 'Promotions' } },
      { path: 'shipping', component: FeaturePlaceholderComponent, data: { title: 'Shipping' } },
      { path: 'payments', component: FeaturePlaceholderComponent, data: { title: 'Payments' } },
      { path: 'users', component: UsersComponent, data: { title: 'Users' } },
      { path: 'roles', component: RolesComponent, data: { title: 'Roles' } },
      { path: 'permissions', component: PermissionsComponent, data: { title: 'Permissions' } },
      { path: 'settings', component: FeaturePlaceholderComponent, data: { title: 'Settings' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
