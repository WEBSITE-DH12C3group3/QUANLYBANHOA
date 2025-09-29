import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Page, Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent implements OnInit {
  private service = inject(SupplierService);
  private router = inject(Router);

  q = '';
  status = ''; // 'active' | 'inactive' | ''
  page = 0;
  size = 20;
  loading = false;

  data?: Page<Supplier>;

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.service.list({
      q: this.q || undefined,
      status: this.status || undefined,
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res: Page<Supplier>) => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  create() {
    this.router.navigate(['/admin/suppliers/new']);
  }

  open(item: Supplier) {
    if (!item.id) return;
    this.router.navigate(['/admin/suppliers', item.id]);
  }

  remove(item: Supplier) {
    if (!item.id) return;
    if (!confirm(`Xóa nhà cung cấp "${item.name}"?`)) return;
    this.loading = true;
    this.service.delete(item.id).subscribe({
      next: () => { this.loading = false; this.fetch(); },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.message || 'Không thể xóa nhà cung cấp (có thể đang được sử dụng).');
      }
    });
  }

  statusClass(s?: string): string {
    switch ((s || '').toLowerCase()) {
      case 'active': return 'bg-green-900 text-green-200';
      case 'inactive': return 'bg-slate-700 text-slate-200';
      default: return 'bg-slate-800 text-slate-200';
    }
  }

  prevPage() { if (this.data && this.page > 0) { this.page--; this.fetch(); } }
  nextPage() { if (this.data?.totalPages && this.page + 1 < this.data.totalPages) { this.page++; this.fetch(); } }
}
