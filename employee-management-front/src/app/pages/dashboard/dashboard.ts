import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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
  imports: [MatCardModule],
  template: `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
      <mat-card>
        <mat-card-title>Active Employees</mat-card-title>
        <mat-card-content>{{ kpis?.activeEmployees ?? 0 }}</mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-title>Pending Requests</mat-card-title>
        <mat-card-content>{{ kpis?.pendingRequests ?? 0 }}</mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-title>Draft Requests</mat-card-title>
        <mat-card-content>{{ kpis?.draftRequests ?? 0 }}</mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-title>Approved Requests</mat-card-title>
        <mat-card-content>{{ kpis?.approvedRequests ?? 0 }}</mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-title>Rejected Requests</mat-card-title>
        <mat-card-content>{{ kpis?.rejectedRequests ?? 0 }}</mat-card-content>
      </mat-card>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  kpis?: DashboardKpi;

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<DashboardKpi>('/dashboard/kpis').subscribe(data => (this.kpis = data));
  }
}
