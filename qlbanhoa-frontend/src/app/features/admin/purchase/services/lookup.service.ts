import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface OptionItem { id: number; name: string; extra?: string; }

@Injectable({ providedIn: 'root' })
export class LookupService {
  constructor(private http: HttpClient) {}

  /** Tìm NCC: trả về {id, name, extra=phone/email} */
  suppliers(q: string, size = 10): Observable<OptionItem[]> {
    const url = `${environment.apiUrl}/admin/suppliers`;
    const params = new HttpParams().set('q', q).set('size', size).set('page', 0);
    return this.http.get<any>(url, { params }).pipe(
      map((res: any) =>
        (res?.content ?? []).map((s: any) => ({
          id: s.id, name: s.name, extra: s.phone || s.email || ''
        }))
      )
    );
  }

  /** Tìm sản phẩm: giả định backend có /api/admin/products?q=&page=&size= */
  products(q: string, size = 10): Observable<OptionItem[]> {
    const url = `${environment.apiUrl}/admin/products`;
    const params = new HttpParams().set('q', q).set('size', size).set('page', 0);
    return this.http.get<any>(url, { params }).pipe(
      map((res: any) =>
        (res?.content ?? res ?? []).map((p: any) => ({
          id: p.id, name: p.name || p.slug || `#${p.id}`, extra: p.sku || ''
        }))
      )
    );
  }
}
