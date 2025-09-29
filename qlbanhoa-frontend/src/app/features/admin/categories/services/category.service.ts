import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryRequest, Page } from '../models/category.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/admin/categories`;

  constructor(private http: HttpClient) {}

  list(params: any): Observable<Page<Category>> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      const v = (params as any)[k];
      if (v !== null && v !== undefined && v !== '') httpParams = httpParams.set(k, v);
    });
    return this.http.get<Page<Category>>(this.baseUrl, { params: httpParams });
  }

  tree(activeOnly = false): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/tree`, { params: { activeOnly } as any });
  }

  create(payload: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload);
  }

  update(id: number, payload: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, payload);
  }

  setActive(id: number, value: boolean) {
    // backend expects /{id}/activate?value=
    return this.http.patch<void>(`${this.baseUrl}/${id}/activate`, null, { params: { value } as any });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}