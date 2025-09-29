import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api';
  user: any = { fullName: '', email: '', phone: '', password: '', roles: [] as number[] };
  roles: any[] = [];
  isEdit = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get<any>(`${this.apiUrl}/users/${id}`).subscribe(res => {
        this.user = { ...res, roles: res.roles.map((r: any) => r.id) };
      });
    }
  }

  loadRoles() {
    this.http.get<any[]>(`${this.apiUrl}/roles`)
      .subscribe(res => this.roles = res);
  }

  saveUser() {
    const payload = {
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
      password: this.isEdit ? undefined : this.user.password,
      roleIds: this.user.roles
    };

    if (this.isEdit) {
      this.http.put(`${this.apiUrl}/users/${this.user.id}`, payload)
        .subscribe(() => this.router.navigate(['/admin/users']));
    } else {
      this.http.post(`${this.apiUrl}/users`, payload)
        .subscribe(() => this.router.navigate(['/admin/users']));
    }
  }
}
