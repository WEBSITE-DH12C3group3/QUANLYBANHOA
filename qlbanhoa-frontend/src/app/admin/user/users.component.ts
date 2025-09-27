import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  users: any[] = [];
  roles: any[] = [];

  // user mới
  newUser = { fullName: '', email: '', phone: '', password: '', roles: [] as number[] };

  // user đang chỉnh sửa
  editUser: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.http.get<any[]>(`${this.apiUrl}/users`)
      .subscribe(res => this.users = res);
  }

  loadRoles() {
    this.http.get<any[]>(`${this.apiUrl}/roles`)
      .subscribe(res => this.roles = res);
  }

  addUser() {
    const payload = {
      fullName: this.newUser.fullName,
      email: this.newUser.email,
      phone: this.newUser.phone,
      passwordHash: this.newUser.password, // backend đang nhận passwordHash
      roleIds: this.newUser.roles
    };

    this.http.post(`${this.apiUrl}/users`, payload)
      .subscribe(() => {
        this.loadUsers();
        this.newUser = { fullName: '', email: '', phone: '', password: '', roles: [] };
      });
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc muốn xóa?')) {
      this.http.delete(`${this.apiUrl}/users/${id}`)
        .subscribe(() => this.loadUsers());
    }
  }

  startEdit(user: any) {
    this.editUser = { ...user, roles: user.roles.map((r: any) => r.id) };
  }

  updateUser() {
    const payload = {
      fullName: this.editUser.fullName,
      phone: this.editUser.phone,
      roleIds: this.editUser.roles
    };

    this.http.put(`${this.apiUrl}/users/${this.editUser.id}`, payload)
      .subscribe(() => {
        this.loadUsers();
        this.editUser = null;
      });
  }
}
