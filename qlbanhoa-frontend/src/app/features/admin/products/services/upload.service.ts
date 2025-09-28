import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class UploadService {
  private baseUrl = `${environment.apiUrl}/admin/uploads`;
  constructor(private http: HttpClient) {}

  upload(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ path: string }>(this.baseUrl, form).pipe(map(r => r.path));
  }
}
