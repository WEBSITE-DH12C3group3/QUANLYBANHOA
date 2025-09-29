import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent implements OnInit {
  apiUrl = 'http://localhost:8080/api/permissions';
  permission: any = { code: '', description: '' };
  isEdit = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get<any>(`${this.apiUrl}/${id}`).subscribe(res => this.permission = res);
    }
  }

  savePermission() {
    if (!this.permission.code.trim()) {
      alert('Code không được để trống');
      return;
    }

    if (this.isEdit) {
      this.http.put(`${this.apiUrl}/${this.permission.id}`, this.permission)
        .subscribe(() => this.router.navigate(['/admin/permissions']));
    } else {
      this.http.post(this.apiUrl, this.permission)
        .subscribe(() => this.router.navigate(['/admin/permissions']));
    }
  }
}
