import { Component, inject } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule],
  template: `
    <mat-sidenav-container class="app-shell" *ngIf="authService.isAuthenticated(); else loginOnly">
      <mat-sidenav mode="side" opened>
        <mat-toolbar color="primary">EMP Portal</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard">Dashboard</a>
          <a mat-list-item routerLink="/employees">Employees</a>
          <a mat-list-item routerLink="/departments">Departments</a>
          <a mat-list-item routerLink="/access-requests">Access Requests</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Employee Management Portal</span>
          <span class="spacer"></span>
          <button mat-button (click)="authService.logout()">Logout</button>
        </mat-toolbar>
        <main style="padding: 24px; background: #f5f5f5; min-height: calc(100vh - 64px);">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <ng-template #loginOnly>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `
  ]
})
export class AppComponent {
  readonly authService = inject(AuthService);
}
