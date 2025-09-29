import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier, SupplierRequest } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './supplier-form.component.html'
})
export class SupplierFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SupplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id?: number;
  title = 'Thêm nhà cung cấp';
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(180)]],
    contactName: [''],
    phone: [''],
    email: ['', [Validators.email]],
    address: [''],
    taxCode: [''],
    status: ['active'], // mặc định
    note: ['']
  });

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.id = id ? +id : undefined;
      this.title = this.id ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp';
      this.initData();
    });
  }

  initData() {
    if (!this.id) return;
    this.loading = true;
    this.service.get(this.id).subscribe({
      next: (s: Supplier) => {
        this.loading = false;
        this.form.patchValue({
          name: s.name,
          contactName: s.contactName || '',
          phone: s.phone || '',
          email: s.email || '',
          address: s.address || '',
          taxCode: s.taxCode || '',
          status: s.status || 'active',
          note: s.note || ''
        });
      },
      error: () => { this.loading = false; }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const payload: SupplierRequest = {
      name: this.form.value.name!,
      contactName: this.form.value.contactName || undefined,
      phone: this.form.value.phone || undefined,
      email: this.form.value.email || undefined,
      address: this.form.value.address || undefined,
      taxCode: this.form.value.taxCode || undefined,
      status: this.form.value.status || undefined,
      note: this.form.value.note || undefined
    };

    const obs = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: (_: Supplier) => {
        this.loading = false;
        this.router.navigate(['/admin/suppliers']); // quay về danh sách
      },
      error: () => { this.loading = false; }
    });
  }
}
