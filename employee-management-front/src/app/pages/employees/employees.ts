import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/services/api.service';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="table-container">
      <div class="table-toolbar">
        <h2>Employees</h2>
        <div style="display: flex; gap: 12px; align-items: center;">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="onSearch($event.target.value)" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openDialog()">New Employee</button>
        </div>
      </div>

      <table mat-table [dataSource]="employees">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">{{ row.firstName }} {{ row.lastName }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let row">{{ row.email }}</td>
        </ng-container>
        <ng-container matColumnDef="department">
          <th mat-header-cell *matHeaderCellDef>Department</th>
          <td mat-cell *matCellDef="let row">{{ row.departmentName }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">{{ row.status }}</td>
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
export class EmployeesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  columns = ['name', 'email', 'department', 'status', 'actions'];
  employees: any[] = [];
  departments: { id: string; name: string }[] = [];
  total = 0;
  pageSize = 10;
  page = 1;
  query = '';

  constructor(private readonly api: ApiService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadEmployees();
  }

  onSearch(value: string) {
    this.query = value;
    this.page = 1;
    this.loadEmployees();
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  openDialog(employee?: any) {
    const ref = this.dialog.open(EmployeeDialogComponent, {
      width: '480px',
      data: { employee, departments: this.departments }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          this.api.put(`/employees/${employee.id}`, result).subscribe(() => this.loadEmployees());
        } else {
          this.api.post('/employees', result).subscribe(() => this.loadEmployees());
        }
      }
    });
  }

  confirmDelete(employee: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete employee',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete(`/employees/${employee.id}`).subscribe(() => this.loadEmployees());
      }
    });
  }

  private loadEmployees() {
    this.api
      .get<any>('/employees', { page: this.page, pageSize: this.pageSize, q: this.query })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.employees = result.items ?? [];
        this.total = result.totalCount ?? 0;
      });
  }

  private loadDepartments() {
    this.api
      .get<any>('/departments', { page: 1, pageSize: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.departments = result.items ?? [];
      });
  }
}
