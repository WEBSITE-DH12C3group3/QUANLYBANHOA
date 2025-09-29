import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ✅ Đường dẫn đúng (từ components/.../category-list/)
import { Category, Page } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private service = inject(CategoryService);
  private router = inject(Router);

  q: string = '';
  active: '' | 'true' | 'false' = '';
  parentId: number | '' = '';
  page = 0;
  size = 20;

  loading = false;
  data?: Page<Category>;
  parents: { id: number, label: string }[] = [];
  parentNameMap = new Map<number, string>();

  ngOnInit() {
    this.loadParents();
    this.fetch();
  }

  loadParents() {
    this.service.tree(false).subscribe((tree: Category[]) => {
      const flat: { id: number, label: string }[] = [];
      const map = new Map<number, string>();
      const walk = (nodes: Category[], depth: number) => {
        for (const c of nodes) {
          const label = `${'— '.repeat(depth)}${c.name}`;
          flat.push({ id: c.id, label });
          map.set(c.id, c.name);
          if (c.children?.length) walk(c.children, depth + 1);
        }
      };
      walk(tree || [], 0);
      this.parents = flat;
      this.parentNameMap = map;
    });
  }

  fetch() {
    this.loading = true;
    const params: any = { page: this.page, size: this.size };
    if (this.q) params.q = this.q;
    if (this.active !== '') params.active = this.active;
    if (this.parentId !== '') params.parentId = this.parentId;

    this.service.list(params).subscribe({
      next: (res: Page<Category>) => { this.data = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newCategory() { this.router.navigate(['/admin/categories/new']); }
  edit(c: Category) { this.router.navigate(['/admin/categories', c.id]); }

  toggleActive(c: Category) {
    this.service.setActive(c.id, !c.isActive).subscribe(() => this.fetch());
  }

  remove(c: Category) {
    if (!confirm('Xóa danh mục này?')) return;
    this.service.delete(c.id).subscribe({
      next: () => this.fetch(),
      error: (err: any) => {
        alert(err?.error?.error || 'Không thể xóa danh mục.');
      }
    });
  }

  prevPage() { if (this.data && this.page > 0) { this.page--; this.fetch(); } }
  nextPage() { if (this.data?.totalPages && this.page + 1 < this.data.totalPages) { this.page++; this.fetch(); } }
}
