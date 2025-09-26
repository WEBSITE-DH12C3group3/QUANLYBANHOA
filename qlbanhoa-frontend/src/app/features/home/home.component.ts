import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../layout/services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-emerald-50">
    <div class="mx-auto max-w-7xl px-4 py-10 lg:py-16">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <!-- Left: brand & hero -->
        <section class="space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span class="text-xs text-gray-600">Quản lý cửa hàng bán hoa</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            QL Bán Hoa <span class="text-emerald-600">Dashboard</span>
          </h1>

          <p class="text-gray-600 text-lg leading-relaxed">
            Quản lý sản phẩm, đơn hàng, nhập hàng và khách hàng trong một giao diện
            <span class="font-medium text-gray-800">nhanh – trực quan – đẹp mắt</span>.
          </p>

          <ul class="grid sm:grid-cols-3 gap-3 text-sm">
            <li class="rounded-2xl bg-white/80 p-4 shadow border">
              <div class="font-semibold">Sản phẩm</div>
              <div class="text-gray-600">Hoa tươi, combo, phụ kiện</div>
            </li>
            <li class="rounded-2xl bg-white/80 p-4 shadow border">
              <div class="font-semibold">Đơn hàng</div>
              <div class="text-gray-600">Quầy & online</div>
            </li>
            <li class="rounded-2xl bg-white/80 p-4 shadow border">
              <div class="font-semibold">Báo cáo</div>
              <div class="text-gray-600">Doanh thu, tồn kho</div>
            </li>
          </ul>

          <div class="flex items-center gap-4">
            <a routerLink="/products"
               class="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 hover:opacity-90">
              Khám phá nhanh
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
            <span class="text-sm text-gray-500">hoặc đăng nhập để bắt đầu</span>
          </div>
        </section>

        <!-- Right: Login card -->
        <section>
          <div class="rounded-3xl bg-white p-6 md:p-8 shadow-xl border">
            <div class="mb-6">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-2xl bg-emerald-100 grid place-content-center">
                  🌸
                </div>
                <div>
                  <div class="text-lg font-semibold">Đăng nhập</div>
                  <div class="text-xs text-gray-500">Truy cập bảng điều khiển</div>
                </div>
              </div>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tài khoản</label>
                <input type="text" formControlName="username" autocomplete="username"
                  class="w-full rounded-xl border px-3 py-2.5 focus:outline-none focus:ring-2 ring-emerald-500" />
                <p class="mt-1 text-xs text-rose-600" *ngIf="submitted() && form.controls.username.invalid">
                  Vui lòng nhập tài khoản
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" formControlName="password" autocomplete="current-password"
                  class="w-full rounded-xl border px-3 py-2.5 focus:outline-none focus:ring-2 ring-emerald-500" />
                <p class="mt-1 text-xs text-rose-600" *ngIf="submitted() && form.controls.password.invalid">
                  Mật khẩu tối thiểu 4 ký tự
                </p>
              </div>

              <div class="flex items-center justify-between">
                <label class="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" formControlName="remember" class="rounded border-gray-300">
                  Ghi nhớ
                </label>
                <a class="text-sm text-emerald-600 hover:underline" href="#">Quên mật khẩu?</a>
              </div>

              <button type="submit"
                class="w-full rounded-xl bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 transition">
                Đăng nhập
              </button>

              <div *ngIf="error()" class="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm p-3">
                {{ error() }}
              </div>
            </form>

            <p class="text-xs text-gray-500 mt-6">
              Demo: username <code class="px-1 rounded bg-gray-100">admin</code>, password <code class="px-1 rounded bg-gray-100">123456</code>
              (tuỳ backend).
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
  `,
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);            // ← thêm dòng này
  submitted = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    remember: [true],
  });

  onSubmit() {
    this.submitted.set(true);
    this.error.set(null);
    this.router.navigateByUrl('/admin');      // hoặc '/admin/dashboard'
    return;
  }
  //   if (this.form.invalid) return;

  //   this.auth.login({
  //     username: this.form.value.username!,
  //     password: this.form.value.password!,
  //   }).subscribe({
  //     next: (res) => {
  //       this.auth.saveToken(res.token);
  //       location.href = '/dashboard'; // hoặc Router điều hướng
  //     },
  //     error: (err) => {
  //       this.error.set(err?.error?.message ?? 'Đăng nhập thất bại, vui lòng thử lại.');
  //     }
  //   });
  // }
}
