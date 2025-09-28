import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attribute } from '../models/product.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private baseUrl = `${environment.apiUrl}/admin/attributes`;
  constructor(private http: HttpClient) {}
  list(): Observable<Attribute[]> { return this.http.get<Attribute[]>(this.baseUrl); }
}
