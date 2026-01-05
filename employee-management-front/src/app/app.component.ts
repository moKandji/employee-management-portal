import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SharedModule,
    NgIf,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <mat-sidenav-container class="app-shell" *ngIf="authService.isAuthenticated(); else loginOnly">
      <!-- SIDEBAR -->
      <mat-sidenav class="sidenav" mode="side" opened>
        <div class="sidenav__brand">
          <div class="brand__logo">EMP</div>
          <div class="brand__text">
            <div class="brand__title">EMP Portal</div>
            <div class="brand__subtitle">Employee Management</div>
          </div>
        </div>

        <div class="sidenav__section-title">Navigation</div>

        <mat-nav-list class="nav">
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon class="nav__icon">dashboard</mat-icon>
            <span class="nav__label">Dashboard</span>
          </a>

          <a mat-list-item routerLink="/employees" routerLinkActive="active">
            <mat-icon class="nav__icon">groups</mat-icon>
            <span class="nav__label">Employees</span>
          </a>

          <a mat-list-item routerLink="/departments" routerLinkActive="active">
            <mat-icon class="nav__icon">apartment</mat-icon>
            <span class="nav__label">Departments</span>
          </a>

          <a mat-list-item routerLink="/access-requests" routerLinkActive="active">
            <mat-icon class="nav__icon">vpn_key</mat-icon>
            <span class="nav__label">Access Requests</span>
          </a>
        </mat-nav-list>

        <div class="sidenav__spacer"></div>

        <div class="sidenav__footer">
          <div class="mini">
            <div class="mini__dot"></div>
            <div class="mini__text">Connected</div>
          </div>

          <button mat-stroked-button class="logout" (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </mat-sidenav>

      <!-- MAIN -->
      <mat-sidenav-content class="content">
        <!-- HEADER -->
        <mat-toolbar class="topbar">
          <div class="topbar__left">
            <div class="topbar__title">Employee Management Portal</div>
            <div class="topbar__meta">Administration</div>
          </div>

          <span class="spacer"></span>

          <div class="topbar__right">
            <button mat-stroked-button class="topbar__btn" (click)="authService.logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </div>
        </mat-toolbar>

        <!-- PAGE -->
        <main class="page">
          <router-outlet></router-outlet>
        </main>

        <!-- FOOTER -->
        <footer class="footer">
          <div class="footer__left">
            © {{ year }} EMP Portal
          </div>
          <div class="footer__right">
            <span>Version dev</span>
            <span class="dot"></span>
            <span>Angular</span>
          </div>
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <ng-template #loginOnly>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }

    /* Shell */
    .app-shell {
      height: 100vh;
      background: #f5f7fa;
    }

    /* Sidenav */
    .sidenav {
      width: 280px;
      border-right: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .sidenav__brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px 12px;
    }

    .brand__logo {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25);
      letter-spacing: 0.5px;
    }

    .brand__title {
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }

    .brand__subtitle {
      color: #64748b;
      font-size: 12px;
      margin-top: 2px;
    }

    .sidenav__section-title {
      padding: 10px 16px 6px;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .nav {
      padding: 0 8px;
    }

    /* Style the list items like pills */
    ::ng-deep .nav .mat-mdc-list-item {
      border-radius: 12px;
      margin: 4px 0;
      overflow: hidden;
    }

    ::ng-deep .nav .mat-mdc-list-item .mdc-list-item__content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav__icon {
      color: #64748b;
    }

    .nav__label {
      font-weight: 600;
      color: #1e293b;
    }

    /* Active link */
    ::ng-deep .nav a.active {
      background: #eff6ff;
      border: 1px solid #dbeafe;
    }

    ::ng-deep .nav a.active .nav__icon {
      color: #2563eb;
    }

    ::ng-deep .nav a.active .nav__label {
      color: #0f172a;
    }

    .sidenav__spacer {
      flex: 1 1 auto;
    }

    .sidenav__footer {
      padding: 14px 16px 16px;
      border-top: 1px solid #e2e8f0;
      display: grid;
      gap: 12px;
    }

    .mini {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-weight: 600;
      font-size: 13px;
    }

    .mini__dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
    }

    .logout {
      width: 100%;
      border-radius: 10px;
    }

    /* Content */
    .content {
      background: #f5f7fa;
    }

    /* Header / Topbar */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 10;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      height: 64px;
    }

    .topbar__left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .topbar__title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }

    .topbar__meta {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }

    .spacer { flex: 1 1 auto; }

    .topbar__btn {
      border-radius: 10px;
      font-weight: 700;
    }

    /* Main page area */
    .page {
      padding: 0; /* tes pages ont déjà leur padding interne (table-container, etc.) */
      min-height: calc(100vh - 64px - 44px);
    }

    /* Footer */
    .footer {
      height: 44px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      color: #64748b;
      font-weight: 600;
      font-size: 13px;
    }

    .footer__right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #cbd5e1;
    }

    @media (max-width: 900px) {
      .sidenav { width: 240px; }
      .topbar__meta { display: none; }
    }
  `]
})
export class AppComponent {
  readonly authService = inject(AuthService);
  readonly year = new Date().getFullYear();
}
