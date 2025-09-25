import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarStateService } from '../../services/sidebar-state.service'; // ⬅️ đúng đường dẫn

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // phải để public để template gọi được: (click)="sidebar.toggle()"
  constructor(public sidebar: SidebarStateService) {}
}
