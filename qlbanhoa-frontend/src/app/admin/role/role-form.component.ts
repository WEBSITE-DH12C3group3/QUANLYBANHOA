import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 🔹 thêm import này

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 🔹 thêm RouterModule
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  role: any = { name: '', permissions: [] as number[] };
  permissions: any[] = [];
  isEdit = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadPermissions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get<any>(`${this.apiUrl}/roles/${id}`)
        .subscribe(res => {
          this.role = { ...res, permissions: res.permissions.map((p: any) => p.id) };
        });
    }
  }

  loadPermissions() {
    this.http.get<any[]>(`${this.apiUrl}/permissions`)
      .subscribe(res => this.permissions = res);
  }

  saveRole() {
    const payload = {
      name: this.role.name,
      permissionIds: this.role.permissions
    };

    if (this.isEdit) {
      this.http.put(`${this.apiUrl}/roles/${this.role.id}`, payload)
        .subscribe(() => this.router.navigate(['/admin/roles']));
    } else {
      this.http.post(`${this.apiUrl}/roles`, payload)
        .subscribe(() => this.router.navigate(['/admin/roles']));
    }
  }
}
