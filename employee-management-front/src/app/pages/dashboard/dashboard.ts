import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

interface DashboardKpi {
  activeEmployees: number;
  pendingRequests: number;
  draftRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatCardModule, MatIconModule],
  styles: [`
    .dashboard-container {
      padding: 24px;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .dashboard-header p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #3b82f6;
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .kpi-icon.primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .kpi-icon.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .kpi-icon.info {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
    }

    .kpi-icon.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .kpi-icon.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-title {
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    .kpi-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .kpi-trend {
      font-size: 12px;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .kpi-trend.negative {
      color: #ef4444;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Aperçu de vos indicateurs clés</p>
      </div>

      <ng-container *ngIf="kpis$ | async as kpis">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-icon primary">
                <mat-icon>people</mat-icon>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-title">Employés Actifs</div>
              <div class="kpi-value">{{ kpis.activeEmployees ?? 0 }}</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-icon warning">
                <mat-icon>pending</mat-icon>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-title">Demandes en Attente</div>
              <div class="kpi-value">{{ kpis.pendingRequests ?? 0 }}</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-icon info">
                <mat-icon>draft</mat-icon>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-title">Brouillons</div>
              <div class="kpi-value">{{ kpis.draftRequests ?? 0 }}</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-icon success">
                <mat-icon>check_circle</mat-icon>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-title">Demandes Approuvées</div>
              <div class="kpi-value">{{ kpis.approvedRequests ?? 0 }}</div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <div class="kpi-icon danger">
                <mat-icon>cancel</mat-icon>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-title">Demandes Rejetées</div>
              <div class="kpi-value">{{ kpis.rejectedRequests ?? 0 }}</div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class DashboardComponent {
  readonly kpis$;

  constructor(private readonly api: ApiService) {
    this.kpis$ = this.api.get<DashboardKpi>('/dashboard/kpis');
  }
}
