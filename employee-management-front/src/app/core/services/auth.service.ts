import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { appConfig } from '../app-config';

interface AuthResponse {
  token: string;
  expiresAt: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'emp_token';
  private readonly roleKey = 'emp_role';
  private readonly loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${appConfig.apiBaseUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.roleKey, response.role);
        this.loggedIn$.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.loggedIn$.next(false);
  }

  isAuthenticated() {
    return this.hasToken();
  }

  token() {
    return localStorage.getItem(this.tokenKey);
  }

  role() {
    return localStorage.getItem(this.roleKey);
  }

  status$() {
    return this.loggedIn$.asObservable();
  }

  private hasToken() {
    return !!localStorage.getItem(this.tokenKey);
  }
}
