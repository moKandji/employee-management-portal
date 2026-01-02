import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { appConfig } from '../app-config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<T>(`${appConfig.apiBaseUrl}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${appConfig.apiBaseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${appConfig.apiBaseUrl}${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${appConfig.apiBaseUrl}${path}`);
  }
}
