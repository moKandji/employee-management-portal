import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, debounceTime, distinctUntilChanged, filter, map, merge, scan, startWith, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AccessRequestDialogComponent } from './access-request-dialog.component';
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
  selector: 'app-access-requests',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgClass,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule
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

    ::ng-deep .mat-mdc-raised-button.add-button:hover {
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

    .action-buttons {
      display: flex;
      gap: 4px;
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

    /* Chips (status/priority) look tighter */
    ::ng-deep .mat-mdc-chip {
      font-size: 12px;
      font-weight: 600;
      border-radius: 999px;
    }

    .chip-approved { background: #dcfce7; color: #166534; }
    .chip-rejected { background: #fee2e2; color: #991b1b; }
    .chip-submitted { background: #dbeafe; color: #1d4ed8; }
    .chip-draft { background: #e2e8f0; color: #334155; }

    .chip-high { background: #ffe4e6; color: #9f1239; }
    .chip-medium { background: #ffedd5; color: #9a3412; }
    .chip-low { background: #e0f2fe; color: #075985; }

    @media (max-width: 768px) {
      .table-container { padding: 16px; }
      .table-toolbar { flex-direction: column; align-items: stretch; }
      .toolbar-actions { flex-direction: column; width: 100%; }
      ::ng-deep .mat-mdc-form-field { width: 100%; }
    }
  `],
  template: `
    <div class="table-container">
      <div class="table-toolbar">
        <h2>Demandes d'accès</h2>

        <div class="toolbar-actions">
          <mat-form-field appearance="outline">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="onSearch($event.target.value)" placeholder="Employé, type, statut..." />
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <button mat-raised-button class="add-button" (click)="openDialog()">
            <mat-icon>add</mat-icon>
            Nouvelle demande
          </button>
        </div>
      </div>

      <ng-container *ngIf="vm$ | async as vm">
        <div class="table-wrapper">
          <table mat-table [dataSource]="vm.items">

            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>Employé</th>
              <td mat-cell *matCellDef="let row">
                <strong>{{ row.employeeName }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let row">{{ row.requestType }}</td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef>Priorité</th>
              <td mat-cell *matCellDef="let row">
                <mat-chip
                  selected
                  [ngClass]="priorityChipClass(row.priority)">
                  {{ row.priority }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let row">
                <mat-chip
                  selected
                  [ngClass]="statusChipClass(row.status)">
                  {{ row.status }}
                </mat-chip>
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

          <mat-paginator
            [length]="vm.total"
            [pageSize]="pageSize"
            (page)="onPage($event)">
          </mat-paginator>
        </div>
      </ng-container>
    </div>
  `
})
export class AccessRequestsComponent {
  private readonly destroyRef = inject(DestroyRef);

  private readonly search$ = new Subject<string>();
  private readonly pageState$ = new Subject<PageState>();
  private readonly refresh$ = new Subject<void>();

  columns = ['employee', 'type', 'priority', 'status', 'actions'];
  employees: any[] = [];
  pageSize = 10;

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
      this.api.get<any>('/accessrequests', {
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
    this.loadEmployees();
    this.refresh$.next();
  }

  onSearch(value: string) {
    this.search$.next(value ?? '');
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageState$.next({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }

  openDialog(request?: any) {
    const ref = this.dialog.open(AccessRequestDialogComponent, {
      width: '500px',
      data: { request, employees: this.employees }
    });

    ref
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          request ? this.api.put(`/accessrequests/${request.id}`, result) : this.api.post('/accessrequests', result)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh$.next());
  }

  confirmDelete(request: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer la demande',
        message: `Êtes-vous sûr de vouloir supprimer la demande pour ${request.employeeName} ?`
      }
    });

    ref
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.api.delete(`/accessrequests/${request.id}`)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refresh$.next());
  }

  private norm(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
}

// --- UI helpers (chips classes) ---
statusChipClass(status: unknown): string {
  const s = this.norm(status);

  // si ton backend renvoie des enums numériques (ex: 0/1/2),
  // tu peux mapper ici si besoin.
  if (s === 'approved' || s === '1') return 'chip-approved';
  if (s === 'rejected' || s === '2') return 'chip-rejected';
  if (s === 'submitted' || s === '0') return 'chip-submitted';
  if (s === 'draft' || s === '3') return 'chip-draft';

  return 'chip-draft';
}

priorityChipClass(priority: unknown): string {
  const p = this.norm(priority);

  // cas enum numérique / nombre
  if (p === '1') return 'chip-high';
  if (p === '2') return 'chip-medium';
  if (p === '3') return 'chip-low';

  // cas texte
  if (p.includes('high') || p.includes('urgent')) return 'chip-high';
  if (p.includes('medium')) return 'chip-medium';
  if (p.includes('low')) return 'chip-low';

  return 'chip-medium';
}

  private loadEmployees() {
    this.api
      .get<any>('/employees', { page: 1, pageSize: 200 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.employees = result.items ?? [];
      });
  }
}
