import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, filter, map, merge, scan, startWith, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

interface PageState {
  pageIndex: number;
  pageSize: number;
}

interface TableState extends PageState {
  query: string;
}

type TablePatch = Partial<TableState>;

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  styles: [`
    .table-container {
      padding: 24px;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .table-toolbar {
      background: white;
      padding: 24px;
      border-radius: 12px 12px 0 0;
      border: 1px solid #e2e8f0;
      border-bottom: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .table-toolbar h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
    }

    .toolbar-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    ::ng-deep .mat-mdc-form-field {
      width: 280px;
    }

    ::ng-deep .mat-mdc-form-field .mat-mdc-text-field-wrapper {
      background: #f8fafc;
    }

::ng-deep .mat-mdc-raised-button.add-button {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      font-weight: 500;
      padding: 0 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
      transition: all 0.2s ease;
    }

    ::ng-deep .mat-mdc-outlined-button.add-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .table-wrapper {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0 0 12px 12px;
      overflow: hidden;
    }

    ::ng-deep .mat-mdc-table {
      background: white;
    }

    ::ng-deep .mat-mdc-header-row {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }

    ::ng-deep .mat-mdc-header-cell {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px;
    }

    ::ng-deep .mat-mdc-cell {
      padding: 16px;
      color: #334155;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
    }

    ::ng-deep .mat-mdc-row {
      transition: background-color 0.15s ease;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: #f8fafc;
    }

    ::ng-deep .mat-mdc-icon-button {
      width: 36px;
      height: 36px;
      padding: 0;
    }

    ::ng-deep .mat-mdc-icon-button.mat-primary {
      color: #3b82f6;
    }

    ::ng-deep .mat-mdc-icon-button.mat-primary:hover {
      background-color: #eff6ff;
    }

    ::ng-deep .mat-mdc-icon-button.mat-warn {
      color: #ef4444;
    }

    ::ng-deep .mat-mdc-icon-button.mat-warn:hover {
      background-color: #fef2f2;
    }

    ::ng-deep .mat-mdc-paginator {
      background: white;
      border-top: 1px solid #e2e8f0;
      border-radius: 0 0 12px 12px;
    }

    ::ng-deep .mat-mdc-paginator-container {
      padding: 16px 24px;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-active {
      background: #dcfce7;
      color: #166534;
    }

    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .table-container {
        padding: 16px;
      }

      .table-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .toolbar-actions {
        flex-direction: column;
        width: 100%;
      }

      ::ng-deep .mat-mdc-form-field {
        width: 100%;
      }
    }
  `],
  template: `
    <div class="table-container">
      <div class="table-toolbar">
        <h2>Gestion des Employé(e)s</h2>
        <div class="toolbar-actions">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="onSearch($event.target.value)" placeholder="Nom, email, département..." />
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button class="add-button" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Nouvel(le) Employé(e)
          </button>
        </div>
      </div>

      <ng-container *ngIf="vm$ | async as vm">
        <div class="table-wrapper">
          <table mat-table [dataSource]="vm.items">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let row">
                <strong>{{ row.firstName }} {{ row.lastName }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let row">{{ row.email }}</td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Département</th>
              <td mat-cell *matCellDef="let row">{{ row.departmentName }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let row">
                <span class="status-badge" [class.status-active]="row.status === 'active'" [class.status-inactive]="row.status !== 'active'">
                  {{ row.status }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let row">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openDialog(row)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(row)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>

          <mat-paginator [length]="vm.total" [pageSize]="pageSize" (page)="onPage($event)"></mat-paginator>
        </div>
      </ng-container>
    </div>
  `
})
export class EmployeesComponent {
  private readonly destroyRef = inject(DestroyRef);

  private readonly search$ = new Subject<string>();
  private readonly pageState$ = new Subject<PageState>();
  private readonly refresh$ = new Subject<void>();

  columns = ['name', 'email', 'department', 'status', 'actions'];

  pageSize = 10;

  departments: { id: string; name: string }[] = [];

  private readonly initialState: TableState = { query: '', pageIndex: 0, pageSize: 10 };

  private readonly queryPatch$ = this.search$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map((query): TablePatch => ({ query, pageIndex: 0 }))
  );

  private readonly pagePatch$ = this.pageState$.pipe(
    map((p): TablePatch => ({ pageIndex: p.pageIndex, pageSize: p.pageSize }))
  );

  private readonly refreshPatch$ = this.refresh$.pipe(map((): TablePatch => ({})));

  readonly vm$ = merge(this.queryPatch$, this.pagePatch$, this.refreshPatch$).pipe(
    startWith(this.initialState as TablePatch),
    scan((state: TableState, patch: TablePatch) => ({ ...state, ...patch }), this.initialState),
    switchMap(state =>
      this.api.get<any>('/employees', {
        page: state.pageIndex + 1,
        pageSize: state.pageSize,
        q: state.query
      })
    ),
    map(result => ({
      items: result.items ?? [],
      total: result.totalCount ?? 0
    }))
  );

  constructor(private readonly api: ApiService, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.loadDepartments();
    this.refresh$.next();
  }

  onSearch(value: string) {
    this.search$.next(value ?? '');
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageState$.next({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  openDialog(employee?: any) {
    const ref = this.dialog.open(EmployeeDialogComponent, {
      width: '480px',
      data: { employee, departments: this.departments }
    });

    ref
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          employee ? this.api.put(`/employees/${employee.id}`, result) : this.api.post('/employees', result)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh$.next());
  }

  confirmDelete(employee: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'employé',
        message: `Êtes-vous sûr de vouloir supprimer ${employee.firstName} ${employee.lastName} ?`
      }
    });

    ref
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.api.delete(`/employees/${employee.id}`)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh$.next());
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
