import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { token: string; user?: { id: number; name: string; role: string; }; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body);
  }

  saveToken(t: string) { localStorage.setItem('token', t); }
  logout() { localStorage.removeItem('token'); }
  get token() { return localStorage.getItem('token'); }
}
