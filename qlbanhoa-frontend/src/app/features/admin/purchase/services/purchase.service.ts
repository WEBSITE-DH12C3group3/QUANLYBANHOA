import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Page, PurchaseOrder, PurchaseOrderRequest, PurchaseOrderStatus } from '../models/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private baseUrl = `${environment.apiUrl}/admin/purchase-orders`;

  constructor(private http: HttpClient) {}

  list(params: any): Observable<Page<PurchaseOrder>> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(k => {
      const v = (params as any)[k];
      if (v !== null && v !== undefined && v !== '') httpParams = httpParams.set(k, v);
    });
    return this.http.get<Page<PurchaseOrder>>(this.baseUrl, { params: httpParams });
  }

  get(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.baseUrl}/${id}`);
  }

  create(userId: number, payload: PurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.baseUrl}`, payload, { params: { userId } as any });
  }

  update(id: number, payload: PurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.baseUrl}/${id}`, payload);
  }

  changeStatus(id: number, value: PurchaseOrderStatus) {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, null, { params: { value } as any });
  }
}
