import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, Page, Attribute } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AttributeService } from '../../services/attribute.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private attributeService = inject(AttributeService);
  private router = inject(Router);

  // filters
  q = '';
  active: string = 'all';
  minPrice?: number | null;
  maxPrice?: number | null;
  attrId?: number | null;
  attrText?: string | null;
  attrNumMin?: number | null;
  attrNumMax?: number | null;
  allAttributes: Attribute[] = [];

  // paging & sorting
  page = 0;
  size = 10;
  sort = 'createdAt,desc';

  data?: Page<Product>;
  loading = false;
  error?: string;

  // fix ảnh: prefix theo environment.apiUrl
  private apiOrigin = new URL(environment.apiUrl, window.location.origin).origin;
  toImg(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${this.apiOrigin}${p}`; // -> http://localhost:8080/uploads/xxx.jpg
  }


  ngOnInit(): void {
    this.attributeService.list().subscribe(list => (this.allAttributes = list));
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error = undefined;
    this.productService.list({
      q: this.q || undefined,
      active: this.active === 'all' ? undefined : this.active === 'true',
      page: this.page,
      size: this.size,
      sort: this.sort,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      attrId: this.attrId ?? undefined,
      attrText: this.attrText ?? undefined,
      attrNumMin: this.attrNumMin ?? undefined,
      attrNumMax: this.attrNumMax ?? undefined
    }).subscribe({
      next: res => {
        this.data = res;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Lỗi tải danh sách';
        this.loading = false;
      }
    });
  }

  newProduct() { this.router.navigate(['/admin/products/new']); }
  edit(p: Product) { this.router.navigate(['/admin/products', p.id, 'edit']); }

  toggle(p: Product) {
    const target = !p.isActive;
    this.productService.setActive(p.id, target).subscribe({
      next: () => (p.isActive = target),
      error: err => {
        console.error('toggle failed', err);
        alert('Đổi trạng thái thất bại');
      }
    });
  }

  clone(p: Product) {
    this.productService.clone(p.id).subscribe({
      next: () => this.fetch(),
      error: () => alert('Nhân bản thất bại')
    });
  }

  remove(p: Product) {
    if (!confirm(`Ẩn sản phẩm "${p.name}"?`)) return;
    this.productService.delete(p.id).subscribe({
      next: () => this.fetch(),
      error: err => alert(err?.error?.message || 'Ẩn thất bại')
    });
  }

  deleteHard(p: Product) {
    if (!confirm(`Xóa vĩnh viễn "${p.name}"?`)) return;
    this.productService.deleteHard(p.id).subscribe({
      next: () => this.fetch(),
      error: () => alert('Xóa thất bại')
    });
  }

  exportCsv() {
    this.productService.exportCsv({
      q: this.q || '',
      active: this.active === 'all' ? '' : this.active === 'true',
      minPrice: this.minPrice ?? '',
      maxPrice: this.maxPrice ?? '',
      attrId: this.attrId ?? '',
      attrText: this.attrText ?? '',
      attrNumMin: this.attrNumMin ?? '',
      attrNumMax: this.attrNumMax ?? '',
      page: this.page,
      size: this.size,
      sort: this.sort
    });
  }

  prevPage() {
    if (this.data && this.page > 0) {
      this.page--;
      this.fetch();
    }
  }
  nextPage() {
    if (this.data && this.data.totalPages && this.page + 1 < this.data.totalPages) {
      this.page++;
      this.fetch();
    }
  }
}
