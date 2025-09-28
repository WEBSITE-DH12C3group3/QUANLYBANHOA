import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { AttributeService } from '../../services/attribute.service';
import { CategoryService, Category } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';
import { Attribute, AttributeValueDTO, ProductRequest } from '../../models/product.model';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private attributeService = inject(AttributeService);
  private categoryService = inject(CategoryService);
  private uploadService = inject(UploadService);

  id?: number;
  title = 'Thêm sản phẩm';
  loading = false;

  allAttributes: Attribute[] = [];
  categories: Category[] = [];

  form: FormGroup = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    slug: ['', Validators.required],
    categoryId: [null],
    unit: [null],
    price: [0, [Validators.required, Validators.min(0)]],
    salePrice: [null],
    costPrice: [null],
    imageUrl: [null],
    thumbnailUrl: [null],
    shortDesc: [null],
    description: [null],
    weightKg: [null],
    isActive: [true],
    attributes: this.fb.array([])
  });

  get attrs(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  private apiOrigin = new URL(environment.apiUrl, window.location.origin).origin;
  toImg(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${this.apiOrigin}${p}`; // -> http://localhost:8080/uploads/xxx.jpg
  }
  

  ngOnInit(): void {
    this.attributeService.list().subscribe(list => (this.allAttributes = list));
    this.categoryService.list().subscribe(list => (this.categories = list));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.title = 'Sửa sản phẩm';
      this.loadDetail(this.id);
    }

    // auto-slug khi người dùng nhập tên
    this.form.get('name')?.valueChanges.subscribe(v => {
      const slugCtrl = this.form.get('slug');
      if (!slugCtrl) return;
      const cur = (slugCtrl.value as string) || '';
      if (!cur) slugCtrl.setValue(this.slugify(v || ''), { emitEvent: false });
    });
  }

  slugify(s: string): string {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  private loadDetail(id: number) {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (p: any) => {
        this.loading = false;
        this.form.patchValue({
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          categoryId: p.categoryId,
          unit: p.unit,
          price: p.price,
          salePrice: p.salePrice,
          costPrice: p.costPrice,
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          shortDesc: p.shortDesc,
          description: p.description,
          weightKg: p.weightKg,
          isActive: p.isActive
        });
        this.attrs.clear();
        (p.attributes || []).forEach((av: any) => this.addAttrRow(av.attributeId, av));
      },
      error: () => {
        this.loading = false;
        alert('Không tải được chi tiết');
      }
    });
  }

  addAttrRow(attributeId?: number, value?: AttributeValueDTO) {
    this.attrs.push(
      this.fb.group({
        attributeId: [attributeId ?? null, Validators.required],
        valueText: [value?.valueText ?? null],
        valueNum: [value?.valueNum ?? null],
        valueBool: [value?.valueBool ?? null],
        valueDate: [value?.valueDate ?? null]
      })
    );
  }

  removeAttrRow(i: number) {
    this.attrs.removeAt(i);
  }

  onAttrChange(i: number) {
    const g = this.attrs.at(i) as FormGroup;
    g.patchValue({ valueText: null, valueNum: null, valueBool: null, valueDate: null });
  }

  dataTypeOf(attributeId: number | null): Attribute['dataType'] | null {
    if (attributeId == null) return null;
    const a = this.allAttributes.find(x => x.id === attributeId);
    return a?.dataType ?? null;
  }

  onPickImage(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.loading = true;
    this.uploadService.upload(file).subscribe({
      next: path => {
        this.form.patchValue({ imageUrl: path });
        this.loading = false;
      },
      error: () => {
        alert('Upload thất bại');
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Vui lòng điền đủ thông tin bắt buộc.');
      return;
    }

    const body: ProductRequest = {
      ...(this.form.value as any),
      attributes: (this.attrs.value as any[]).map(row => {
        const dt = this.dataTypeOf(row.attributeId);
        const out: AttributeValueDTO = { attributeId: row.attributeId };
        if (dt === 'TEXT') out.valueText = row.valueText ?? null;
        else if (dt === 'NUMBER') out.valueNum = row.valueNum ?? null;
        else if (dt === 'BOOLEAN') out.valueBool = row.valueBool ?? null;
        else if (dt === 'DATE') out.valueDate = row.valueDate ?? null;
        return out;
      })
    };

    this.loading = true;
    const obs = this.id
      ? this.productService.update(this.id, body)
      : this.productService.create(body);

    obs.subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: err => {
        alert(err?.error?.message || 'Lưu thất bại');
        this.loading = false;
      }
    });
  }

  deleteHard() {
    if (!this.id) return;
    if (!confirm('Xóa vĩnh viễn sản phẩm này?')) return;
    this.productService.deleteHard(this.id).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => alert('Xóa thất bại')
    });
  }
}
