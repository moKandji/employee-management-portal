import { Component, OnInit } from '@angular/core';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/services/api.service';
import { DepartmentDialogComponent } from './department-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="table-container">
      <div class="table-toolbar">
        <h2>Departments</h2>
        <div style="display: flex; gap: 12px; align-items: center;">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="onSearch($event.target.value)" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="openDialog()">New Department</button>
        </div>
      </div>

      <table mat-table [dataSource]="departments">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
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
export class DepartmentsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  columns = ['name', 'actions'];
  departments: any[] = [];
  total = 0;
  pageSize = 10;
  page = 1;
  query = '';

  constructor(private readonly api: ApiService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.loadDepartments();
  }

  onSearch(value: string) {
    this.query = value;
    this.page = 1;
    this.loadDepartments();
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadDepartments();
  }

  openDialog(department?: any) {
    const ref = this.dialog.open(DepartmentDialogComponent, {
      width: '400px',
      data: { department }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        if (department) {
          this.api.put(`/departments/${department.id}`, result).subscribe(() => this.loadDepartments());
        } else {
          this.api.post('/departments', result).subscribe(() => this.loadDepartments());
        }
      }
    });
  }

  confirmDelete(department: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete department',
        message: `Are you sure you want to delete ${department.name}?`
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete(`/departments/${department.id}`).subscribe(() => this.loadDepartments());
      }
    });
  }

  private loadDepartments() {
    this.api
      .get<any>('/departments', { page: this.page, pageSize: this.pageSize, q: this.query })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.departments = result.items ?? [];
        this.total = result.totalCount ?? 0;
      });
  }
}
