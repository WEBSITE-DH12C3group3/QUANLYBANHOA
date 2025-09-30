import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/users';
  users: any[] = [];

  search = { keyword: '' };
  page = 1;            // frontend dùng 1-based
  pageSize = 5;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    let params = new HttpParams()
      .set('page', (this.page - 1).toString())  // ✅ backend cần 0-based
      .set('size', this.pageSize.toString());

    if (this.search.keyword && this.search.keyword.trim() !== '') {
      params = params.set('q', this.search.keyword.trim());
    }

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (res) => {
        if (res.content) {
          this.users = res.content;
          this.totalPages = res.totalPages;
        } else {
          this.users = res;
          this.totalPages = 1;
        }
      },
      error: (err) => console.error('Lỗi load users:', err)
    });
  }

  searchUsers() {
    this.page = 1; // ✅ reset về trang đầu khi tìm kiếm
    this.loadUsers();
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc muốn xóa user này?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Lỗi xóa user:', err)
      });
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}
