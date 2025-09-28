import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Product, ProductRequest } from '../models/product.model';
import { environment } from '../../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/admin/products`;

  constructor(private http: HttpClient) {}

  list(params: any): Observable<Page<Product>> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      const v = params[k];
      if (v !== null && v !== undefined && v !== '') httpParams = httpParams.set(k, v);
    });
    if (!httpParams.get('page')) httpParams = httpParams.set('page', '0');
    if (!httpParams.get('size')) httpParams = httpParams.set('size', '10');
    if (!httpParams.get('sort')) httpParams = httpParams.set('sort', 'createdAt,desc');
    return this.http.get<Page<Product>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Product> { return this.http.get<Product>(`${this.baseUrl}/${id}`); }
  create(body: ProductRequest): Observable<Product> { return this.http.post<Product>(this.baseUrl, body); }
  update(id: number, body: ProductRequest): Observable<Product> { return this.http.put<Product>(`${this.baseUrl}/${id}`, body); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
  deleteHard(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}/hard`); }

  // 🔁 gửi JSON body để backend đọc ổn định
  setActive(id: number, value: boolean) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/active`, { value });
  }

  clone(id: number) { return this.http.post<Product>(`${this.baseUrl}/${id}/clone`, {}); }

  exportCsv(params: any) {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      const v = params[k];
      if (v !== null && v !== undefined && v !== '') httpParams = httpParams.set(k, v);
    });
    const url = `${this.baseUrl}/export.csv?${httpParams.toString()}`;
    window.open(url, '_blank');
  }
}
