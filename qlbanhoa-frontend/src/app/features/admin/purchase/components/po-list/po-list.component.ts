import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Page, PurchaseOrder, PurchaseOrderStatus } from '../../models/purchase.model';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './po-list.component.html'
})
export class PoListComponent implements OnInit {
  private service = inject(PurchaseService);
  private router = inject(Router);

  q = '';
  status: '' | PurchaseOrderStatus = '';
  supplierId: number | '' = '';

  page = 0;
  size = 20;
  loading = false;
  data?: Page<PurchaseOrder>;

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    const params: any = { page: this.page, size: this.size };
    if (this.q) params.q = this.q;
    if (this.status) params.status = this.status;
    if (this.supplierId !== '') params.supplierId = this.supplierId;

    this.service.list(params).subscribe({
      next: (res: Page<PurchaseOrder>) => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newPO() { this.router.navigate(['/admin/purchase-orders/new']); }
  open(po: PurchaseOrder) { this.router.navigate(['/admin/purchase-orders', po.id]); }

  statusClass(s: PurchaseOrderStatus) {
    switch (s) {
      case 'draft': return 'bg-slate-800 text-slate-200';
      case 'ordered': return 'bg-amber-900 text-amber-200';
      case 'received': return 'bg-green-900 text-green-200';
      case 'cancelled': return 'bg-rose-900 text-rose-200';
    }
  }

  prevPage() { if (this.data && this.page > 0) { this.page--; this.fetch(); } }
  nextPage() { if (this.data?.totalPages && this.page + 1 < this.data.totalPages) { this.page++; this.fetch(); } }
}
