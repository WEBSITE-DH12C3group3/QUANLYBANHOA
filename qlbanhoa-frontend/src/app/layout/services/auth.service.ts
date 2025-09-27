import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'token';
  private userKey = 'user';
  private profile: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /** ========== LOGIN ========== */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        // lưu token + user vào localStorage
        this.saveTokens(res.accessToken, res.refreshToken); this.saveUser({
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          roles: res.roles,
          permissions: res.permissions
        });
      })
    );
  }

  /** ========== REGISTER ========== */
  register(data: { fullName: string; email: string; phone: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  /** ========== TOKEN HANDLING ========== */
private accessTokenKey = 'accessToken';
private refreshTokenKey = 'refreshToken';

saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(this.accessTokenKey, accessToken);
  localStorage.setItem(this.refreshTokenKey, refreshToken);
}

getAccessToken(): string | null {
  return localStorage.getItem(this.accessTokenKey);
}

getRefreshToken(): string | null {
  return localStorage.getItem(this.refreshTokenKey);
}

clearTokens() {
  localStorage.removeItem(this.accessTokenKey);
  localStorage.removeItem(this.refreshTokenKey);
}

refreshToken(): Observable<any> {
  const refreshToken = this.getRefreshToken();
  return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
    tap((res: any) => {
      this.saveTokens(res.accessToken, res.refreshToken);
    })
  );
}



  /** ========== USER HANDLING ========== */
  saveUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.profile = user;
  }

  getUser(): any {
    if (this.profile) return this.profile;
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem(this.userKey);
      this.profile = raw ? JSON.parse(raw) : null;
      return this.profile;
    }
    return null;
  }

  clearUser() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.userKey);
    }
    this.profile = null;
  }

  /** ========== LOGOUT ========== */
logout() {
  this.clearTokens();
  localStorage.removeItem(this.userKey);
  this.profile = null;
}



  /** ========== CHECK LOGIN ========== */
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  /** ========== PROFILE API ========== */
loadProfile(): Observable<any> {
  const token = this.getAccessToken();
  return this.http.get(`${this.apiUrl}/users/me/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    tap((p: any) => {
      this.saveUser(p);
    })
  );
}


  getProfile(): any {
    return this.getUser();
  }

  /** ========== PERMISSION CHECK ========== */
  hasPermission(code: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    return user.permissions?.includes(code);
  }
}
