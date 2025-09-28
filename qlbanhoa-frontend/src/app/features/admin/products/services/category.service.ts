import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Category { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/admin/categories`;
  constructor(private http: HttpClient) {}
  list(): Observable<Category[]> { return this.http.get<Category[]>(this.baseUrl); }
}
