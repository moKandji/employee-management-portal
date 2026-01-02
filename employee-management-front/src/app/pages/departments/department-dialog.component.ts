import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.department ? 'Edit Department' : 'New Department' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `
})
export class DepartmentDialogComponent {
  form;

  constructor(
    private readonly fb: FormBuilder,
    public readonly dialogRef: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { department?: any }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    if (data?.department) {
      this.form.patchValue(data.department);
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}
