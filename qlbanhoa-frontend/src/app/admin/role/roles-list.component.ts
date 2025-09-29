import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './roles-list.component.html'
})
export class RolesListComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  roles: any[] = [];

  search = { keyword: '' };
  page = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    let params = new HttpParams()
      .set('page', this.page)
      .set('size', this.pageSize);

    if (this.search.keyword && this.search.keyword.trim() !== '') {
      params = params.set('q', this.search.keyword.trim());
    }

    this.http.get<any>(`${this.apiUrl}/roles`, { params })
      .subscribe({
        next: (res) => {
          if (res.content) {
            this.roles = res.content;
            this.totalPages = res.totalPages;
          } else {
            this.roles = res;
            this.totalPages = 1;
          }
        },
        error: (err) => console.error('Lỗi load roles:', err)
      });
  }

  deleteRole(id: number) {
    if (confirm('Bạn có chắc muốn xóa role này?')) {
      this.http.delete(`${this.apiUrl}/roles/${id}`)
        .subscribe({
          next: () => this.loadRoles(),
          error: (err) => console.error('Lỗi xóa role:', err)
        });
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadRoles();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadRoles();
    }
  }
}
