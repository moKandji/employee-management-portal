import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-access-request-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.request ? 'Edit Access Request' : 'New Access Request' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content style="display: grid; gap: 12px;">
        <mat-form-field appearance="outline">
          <mat-label>Employee</mat-label>
          <mat-select formControlName="employeeId">
            <mat-option *ngFor="let employee of data.employees" [value]="employee.id">
              {{ employee.firstName }} {{ employee.lastName }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Request type</mat-label>
          <mat-select formControlName="requestType">
            <mat-option value="SystemAccess">System Access</mat-option>
            <mat-option value="Badge">Badge</mat-option>
            <mat-option value="AccountCreation">Account Creation</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Draft">Draft</mat-option>
            <mat-option value="Submitted">Submitted</mat-option>
            <mat-option value="Approved">Approved</mat-option>
            <mat-option value="Rejected">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Comment</mat-label>
          <textarea matInput formControlName="comment" rows="3"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `
})
export class AccessRequestDialogComponent {
  form = this.fb.group({
    employeeId: ['', Validators.required],
    requestType: ['SystemAccess', Validators.required],
    priority: ['Medium', Validators.required],
    status: ['Draft', Validators.required],
    comment: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<AccessRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request?: any; employees: any[] }
  ) {
    if (data?.request) {
      this.form.patchValue(data.request);
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
