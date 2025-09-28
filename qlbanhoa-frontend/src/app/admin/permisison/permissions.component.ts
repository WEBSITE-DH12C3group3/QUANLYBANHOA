import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  permissions: any[] = [];

  newPermission = { code: '', description: '' };
  editPermission: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPermissions();
  }

  // Lấy tất cả permissions
  loadPermissions() {
    this.http.get<any[]>(`${this.apiUrl}/permissions`)
      .subscribe(res => this.permissions = res);
  }

  // Thêm mới
  addPermission() {
    if (!this.newPermission.code) return;

    this.http.post(`${this.apiUrl}/permissions`, this.newPermission)
      .subscribe(() => {
        this.loadPermissions();
        this.newPermission = { code: '', description: '' };
      });
  }

  // Bắt đầu sửa
  startEdit(permission: any) {
    this.editPermission = { ...permission };
  }

  // Cập nhật
  updatePermission() {
    this.http.put(`${this.apiUrl}/permissions/${this.editPermission.id}`, this.editPermission)
      .subscribe(() => {
        this.loadPermissions();
        this.editPermission = null;
      });
  }

  // Xóa
  deletePermission(id: number) {
    if (confirm('Bạn có chắc muốn xóa permission này?')) {
      this.http.delete(`${this.apiUrl}/permissions/${id}`)
        .subscribe(() => this.loadPermissions());
    }
  }
}
