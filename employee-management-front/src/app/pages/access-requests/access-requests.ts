import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../core/services/api.service';
import { AccessRequestDialogComponent } from './access-request-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-access-requests',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
  ],
  template: `
    <div class="table-container">
      <div class="table-toolbar">
        <h2>Access Requests</h2>
        <div style="display: flex; gap: 12px; align-items: center;">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="onSearch($event.target.value)" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openDialog()">New Request</button>
        </div>
      </div>

      <table mat-table [dataSource]="requests">
        <ng-container matColumnDef="employee">
          <th mat-header-cell *matHeaderCellDef>Employee</th>
          <td mat-cell *matCellDef="let row">{{ row.employeeName }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let row">{{ row.requestType }}</td>
        </ng-container>
        <ng-container matColumnDef="priority">
          <th mat-header-cell *matHeaderCellDef>Priority</th>
          <td mat-cell *matCellDef="let row">{{ row.priority }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <mat-chip [color]="statusColor(row.status)" selected>{{ row.status }}</mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" (click)="openDialog(row)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="confirmDelete(row)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      <mat-paginator [length]="total" [pageSize]="pageSize" (page)="onPage($event)"></mat-paginator>
    </div>
  `
})
export class AccessRequestsComponent implements OnInit {
  columns = ['employee', 'type', 'priority', 'status', 'actions'];
  requests: any[] = [];
  employees: any[] = [];
  total = 0;
  pageSize = 10;
  page = 1;
  query = '';

  constructor(private readonly api: ApiService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadRequests();
  }

  onSearch(value: string) {
    this.query = value;
    this.page = 1;
    this.loadRequests();
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadRequests();
  }

  openDialog(request?: any) {
    const ref = this.dialog.open(AccessRequestDialogComponent, {
      width: '500px',
      data: { request, employees: this.employees }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        if (request) {
          this.api.put(`/accessrequests/${request.id}`, result).subscribe(() => this.loadRequests());
        } else {
          this.api.post('/accessrequests', result).subscribe(() => this.loadRequests());
        }
      }
    });
  }

  confirmDelete(request: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete access request',
        message: `Are you sure you want to delete this request for ${request.employeeName}?`
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete(`/accessrequests/${request.id}`).subscribe(() => this.loadRequests());
      }
    });
  }

  statusColor(status: string) {
    switch (status) {
      case 'Approved':
        return 'primary';
      case 'Rejected':
        return 'warn';
      case 'Submitted':
        return 'accent';
      default:
        return undefined;
    }
  }

  private loadRequests() {
    this.api
      .get<any>('/accessrequests', {
        page: this.page,
        pageSize: this.pageSize,
        q: this.query
      })
      .subscribe(result => {
        this.requests = result.items;
        this.total = result.totalCount;
      });
  }

  private loadEmployees() {
    this.api.get<any>('/employees', { page: 1, pageSize: 200 }).subscribe(result => {
      this.employees = result.items;
    });
  }
}