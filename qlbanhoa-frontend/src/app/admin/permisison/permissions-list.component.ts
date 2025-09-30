import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './permissions-list.component.html'
})
export class PermissionsListComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/permissions';
  permissions: any[] = [];

  search = { keyword: '' };
  page = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPermissions();
  }

loadPermissions() {
  let params = new HttpParams()
    .set('page', this.page - 1) // ⚠️ backend page = 0-based
    .set('size', this.pageSize);

  if (this.search.keyword && this.search.keyword.trim() !== '') {
    params = params.set('q', this.search.keyword.trim());
  }

  this.http.get<any>(this.apiUrl, { params }).subscribe({
    next: (res) => {
      this.permissions = res.content;
      this.totalPages = res.totalPages;
    },
    error: (err) => console.error('Lỗi load permissions:', err)
  });
}

onSearch() {
  this.page = 1; // reset về trang đầu
  this.loadPermissions();
}


  deletePermission(id: number) {
    if (confirm('Bạn có chắc muốn xóa permission này?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadPermissions(),
        error: (err) => console.error('Lỗi xóa permission:', err)
      });
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPermissions();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPermissions();
    }
  }
}
