import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';
import { LookupService, OptionItem } from '../../services/lookup.service';
import {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderRequest,
  PurchaseOrderStatus
} from '../../models/purchase.model';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './po-form.component.html'
})
export class PoFormComponent implements OnInit {
  private lookup = inject(LookupService);

  // --- Autocomplete NCC ---
  supplierQuery = '';
  supplierOptions: OptionItem[] = [];
  showSupplierDrop = false;

  // --- Autocomplete SP cho từng dòng ---
  productQuery: string[] = [];
  productOptions: OptionItem[][] = [];
  showProductDrop: boolean[] = [];

  // style vị trí cho dropdown SP (overlay fixed)
  productPanelStyle: Array<Partial<CSSStyleDeclaration>> = [];

  private fb = inject(FormBuilder);
  private service = inject(PurchaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id?: number;
  title = 'Tạo phiếu nhập';
  loading = false;

  form = this.fb.group({
    supplierId: [null as number | null, [Validators.required]],
    expectedDate: [''],
    note: [''],
    discount: [0],
    discountMode: ['amount' as 'amount' | 'percent'], // ✅ thêm: chế độ giảm
    items: this.fb.array([] as any[])
  });

  get items(): FormArray { return this.form.get('items') as FormArray; }
  ctrl(i: number, name: string) { return (this.items.at(i) as any).get(name); }

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id');
      this.id = id ? +id : undefined;
      this.title = this.id ? 'Chi tiết phiếu nhập' : 'Tạo phiếu nhập';
      this.initData();
    });
  }

  private row(item?: Partial<PurchaseOrderItem>) {
    return this.fb.group({
      productId: [item?.productId ?? null, [Validators.required]],
      qty: [item?.qty ?? 1, [Validators.required, Validators.min(1)]],
      unitCost: [item?.unitCost ?? 0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: item?.subtotal ?? 0, disabled: true }]
    });
  }

  addRow() {
    this.items.push(this.row({ qty: 1, unitCost: 0 }));
    const i = this.items.length - 1;
    this.productQuery[i] = '';
    this.productOptions[i] = [];
    this.showProductDrop[i] = false;
    this.productPanelStyle[i] = {};
    this.recalc();
  }

  removeRow(i: number) {
    this.items.removeAt(i);
    this.productQuery.splice(i, 1);
    this.productOptions.splice(i, 1);
    this.showProductDrop.splice(i, 1);
    this.productPanelStyle.splice(i, 1);
    this.recalc();
  }

  initData() {
    if (!this.id) {
      this.addRow();
      return;
    }
    this.loading = true;
    this.service.get(this.id).subscribe({
      next: (po: PurchaseOrder) => {
        this.loading = false;
        this.form.patchValue({
          supplierId: po.supplierId,
          expectedDate: po.expectedDate || '',
          note: po.note || '',
          discount: po.discount || 0,
          discountMode: 'amount' // dữ liệu cũ chỉ có số tiền
        });
        this.supplierQuery = po.supplierId ? `#${po.supplierId}` : '';
        this.items.clear();
        this.productQuery = [];
        this.productOptions = [];
        this.showProductDrop = [];
        this.productPanelStyle = [];
        for (const it of (po.items || [])) {
          this.items.push(this.row(it));
          this.productQuery.push(it.productId ? `#${it.productId}` : '');
          this.productOptions.push([]);
          this.showProductDrop.push(false);
          this.productPanelStyle.push({});
        }
        this.recalc();
      },
      error: () => { this.loading = false; }
    });
  }

  recalc() {
    let subtotal = 0;
    for (const c of this.items.controls) {
      const qty = +(c.get('qty')?.value || 0);
      const unitCost = +(c.get('unitCost')?.value || 0);
      const sub = qty * unitCost;
      c.get('subtotal')?.setValue(sub, { emitEvent: false });
      subtotal += sub;
    }
    const raw = +(this.form.get('discount')?.value || 0);
    const mode = this.form.get('discountMode')?.value as 'amount' | 'percent';
    const discount = mode === 'percent'
      ? Math.round(subtotal * Math.max(0, Math.min(100, raw)) / 100)
      : raw;

    return { subtotal, discount, total: subtotal - discount };
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const calc = this.recalc(); // ✅ luôn gửi số tiền giảm sau quy đổi

    const payload: PurchaseOrderRequest = {
      supplierId: this.form.value.supplierId!,
      expectedDate: this.form.value.expectedDate || undefined,
      note: this.form.value.note || undefined,
      discount: calc.discount,
      items: (this.items.getRawValue() as PurchaseOrderItem[]).map(r => ({
        productId: +r.productId, qty: +r.qty, unitCost: +r.unitCost
      }))
    };

    const obs = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(1, payload); // TODO: thay 1 = userId thật từ AuthService

    obs.subscribe({
      next: (res: PurchaseOrder) => { this.loading = false; this.router.navigate(['/admin/purchase-orders', res.id]); },
      error: () => { this.loading = false; }
    });
  }

  changeStatus(value: PurchaseOrderStatus) {
    if (!this.id) return;
    this.loading = true;
    this.service.changeStatus(this.id, value).subscribe({
      next: () => { this.loading = false; this.initData(); },
      error: () => { this.loading = false; }
    });
  }

  /* ====== Autocomplete Supplier ====== */
  onSupplierInput() {
    const q = this.supplierQuery?.trim();
    if (!q) { this.supplierOptions = []; this.showSupplierDrop = false; this.form.get('supplierId')?.setValue(null); return; }
    this.lookup.suppliers(q).subscribe(opts => {
      this.supplierOptions = opts;
      this.showSupplierDrop = opts.length > 0;
    });
  }

  pickSupplier(opt: OptionItem) {
    this.form.get('supplierId')?.setValue(opt.id);
    this.supplierQuery = `${opt.name} (#${opt.id})`;
    this.showSupplierDrop = false;
  }

  blurSupplier() {
    const id = this.form.value.supplierId;
    if (!id || !this.supplierQuery.includes(`#${id}`)) {
      const m = this.supplierQuery.match(/#(\d+)/);
      this.form.get('supplierId')?.setValue(m ? +m[1] : null);
    }
    setTimeout(() => this.showSupplierDrop = false, 150);
  }

  /* ====== Autocomplete Product (overlay fixed) ====== */
  private updateProductPanelPos(i: number, inputEl: HTMLElement) {
    const rc = inputEl.getBoundingClientRect();
    const panelWidth = Math.min(520, Math.max(360, rc.width + 120));
    const left = Math.max(8, Math.min(rc.left, window.innerWidth - panelWidth - 8));
    const top = rc.bottom + 4;

    this.productPanelStyle[i] = { left: `${left}px`, top: `${top}px`, width: `${panelWidth}px` };
  }

  onProductInput(i: number, ev?: Event) {
    const q = (this.productQuery[i] || '').trim();
    const el = ev?.target as HTMLElement | undefined;
    if (el) this.updateProductPanelPos(i, el);

    if (!q) {
      this.productOptions[i] = [];
      this.showProductDrop[i] = false;
      this.ctrl(i, 'productId')?.setValue(null);
      return;
    }
    if (!this.productOptions[i]) this.productOptions[i] = [];
    this.lookup.products(q).subscribe(opts => {
      this.productOptions[i] = opts;
      this.showProductDrop[i] = opts.length > 0;
    });
  }

  pickProduct(i: number, opt: OptionItem) {
    this.ctrl(i, 'productId')?.setValue(opt.id);
    this.productQuery[i] = `${opt.name} (#${opt.id})`;
    this.showProductDrop[i] = false;
    this.recalc();
  }

  blurProduct(i: number) {
    const id = this.ctrl(i, 'productId')?.value;
    const q = this.productQuery[i] || '';
    if (!id || !q.includes(`#${id}`)) {
      const m = q.match(/#(\d+)/);
      this.ctrl(i, 'productId')?.setValue(m ? +m[1] : null);
    }
    setTimeout(() => this.showProductDrop[i] = false, 120);
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  hideAllProductDrops() {
    this.showProductDrop = this.showProductDrop.map(() => false);
  }
}
