import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// ✅ Đường dẫn đúng (từ components/.../category-form/)
import { Category, CategoryRequest } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id?: number;
  title = 'Thêm danh mục';
  loading = false;

  parents: Category[] = [];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    slug: ['', [Validators.required, Validators.maxLength(140)]],
    parentId: [null as number | null],
    isActive: [true],
    sortOrder: [0, [Validators.required]]
  });

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.id = id ? +id : undefined;
      this.title = this.id ? 'Sửa danh mục' : 'Thêm danh mục';
      this.initData();
    });

    // auto slugify
    this.form.get('name')?.valueChanges.subscribe((name: string | null) => {
      const slugCtrl = this.form.get('slug');
      if (slugCtrl && (!slugCtrl.value || String(slugCtrl.value).trim() === '')) {
        slugCtrl.setValue(this.slugify(name || ''), { emitEvent: false });
      }
    });
  }

  initData() {
    // ✅ gán kiểu rõ ràng cho tree
    this.service.tree(false).subscribe((tree: Category[]) => {
      this.parents = tree || [];
      if (this.id) {
        const target = this.findInTree(this.parents, this.id!);
        if (target) {
          this.form.patchValue({
            name: target.name,
            slug: target.slug,
            parentId: target.parentId ?? null,
            isActive: target.isActive,
            sortOrder: target.sortOrder
          });
        }
      }
    });
  }

  private findInTree(list: Category[], id: number): Category | undefined {
    for (const c of list) {
      if (c.id === id) return c;
      if (c.children?.length) {
        const found = this.findInTree(c.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const payload = this.form.value as CategoryRequest;

    const obs = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/admin/categories']); },
      error: () => { this.loading = false; }
    });
  }

  deleteHard() {
    if (!this.id) return;
    if (!confirm('Xóa danh mục này?')) return;
    this.loading = true;
    this.service.delete(this.id).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/admin/categories']); },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.error || 'Không thể xóa danh mục.');
      }
    });
  }

  slugify(input: string): string {
    const str = (input || '').toLowerCase().trim();
    const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
    const to   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
    let res = '';
    for (let i = 0; i < str.length; i++) {
      const idx = from.indexOf(str[i]);
      res += (idx > -1) ? to[idx] : str[i];
    }
    return res
      .normalize('NFD').replace(/\p{Diacritic}+/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
