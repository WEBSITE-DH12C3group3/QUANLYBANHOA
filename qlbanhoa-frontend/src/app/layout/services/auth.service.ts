import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private profile: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /** Gọi API login */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }
  register(data: { fullName: string; email: string; phone: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
  /** Lưu token */
  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  /** Lấy token */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /** Xóa token */
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.profile = null;
  }

  /** Kiểm tra đăng nhập */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Gọi API lấy profile user hiện tại */
  loadProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me/profile`).pipe(
      tap((p: any) => (this.profile = p))
    );
  }

  getProfile(): any {
    return this.profile;
  }

  /** Kiểm tra quyền */
  hasPermission(code: string): boolean {
    if (!this.profile) return false;
    return this.profile.permissions?.includes(code);
  }
}
