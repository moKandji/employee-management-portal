import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface EmployeeDialogData {
  employee?: any;
  departments: { id: string; name: string }[];
}

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.employee ? 'Edit Employee' : 'New Employee' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content style="display: grid; gap: 12px;">
        <mat-form-field appearance="outline">
          <mat-label>First name</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Last name</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId">
            <mat-option *ngFor="let dept of data.departments" [value]="dept.id">{{ dept.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `
})
export class EmployeeDialogComponent {
  form;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      departmentId: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    if (data.employee) {
      this.form.patchValue(data.employee);
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
