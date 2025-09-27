import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  roles: any[] = [];
  permissions: any[] = [];

  newRole = { name: '', permissions: [] as number[] };
  editRole: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.http.get<any[]>(`${this.apiUrl}/roles`)
      .subscribe(res => this.roles = res);
  }

  loadPermissions() {
    this.http.get<any[]>(`${this.apiUrl}/permissions`)
      .subscribe(res => this.permissions = res);
  }

  addRole() {
    const payload = {
      name: this.newRole.name,
      permissionIds: this.newRole.permissions
    };

    this.http.post(`${this.apiUrl}/roles`, payload)
      .subscribe(() => {
        this.loadRoles();
        this.newRole = { name: '', permissions: [] };
      });
  }

  deleteRole(id: number) {
    if (confirm('Bạn có chắc muốn xóa role này?')) {
      this.http.delete(`${this.apiUrl}/roles/${id}`)
        .subscribe(() => this.loadRoles());
    }
  }

  startEdit(role: any) {
    this.editRole = { ...role, permissions: role.permissions.map((p: any) => p.id) };
  }

  updateRole() {
    const payload = {
      name: this.editRole.name,
      permissionIds: this.editRole.permissions
    };

    this.http.put(`${this.apiUrl}/roles/${this.editRole.id}`, payload)
      .subscribe(() => {
        this.loadRoles();
        this.editRole = null;
      });
  }
}
