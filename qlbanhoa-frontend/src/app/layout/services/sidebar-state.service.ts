import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  open = false;
  toggle() { this.open = !this.open; }
  openMenu() { this.open = true; }
  close() { this.open = false; }
}
