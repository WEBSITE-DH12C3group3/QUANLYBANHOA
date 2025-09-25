import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, passwordHash: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, passwordHash });
  }

register(data: { fullName: string; email: string; phone: string; passwordHash: string }) {
  return this.http.post(`${this.apiUrl}/register`, data);
}


  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
