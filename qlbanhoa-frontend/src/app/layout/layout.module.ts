import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// ❗️Lưu ý: các component dưới đây đang `standalone: true`
import { AdminLayoutComponent } from './admin-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  // ❌ Bỏ declarations vì standalone không được khai báo tại đây
  // declarations: [ AdminLayoutComponent, HeaderComponent, SidebarComponent ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,

    // ✅ Import thẳng các standalone components
    AdminLayoutComponent,
    HeaderComponent,
    SidebarComponent
  ]
})
export class LayoutModule {}
