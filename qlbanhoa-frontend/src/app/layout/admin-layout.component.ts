import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';          // ⬅️ cần cho *ngIf, ngClass...
import { RouterModule } from '@angular/router';          // ⬅️ cần cho <router-outlet>
import { SidebarStateService } from './services/sidebar-state.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent], // ⬅️ thêm CommonModule
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  constructor(public sidebar: SidebarStateService) {}
}
