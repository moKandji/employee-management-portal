import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div style="display: flex; justify-content: center; padding: 48px;">
      <mat-card style="width: 420px;">
        <mat-card-header>
          <mat-card-title>Sign in</mat-card-title>
          <mat-card-subtitle>Use a demo account to explore the portal</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Login</button>
          </form>
          <p style="margin-top: 16px; font-size: 13px; color: #616161;">
            Demo users: admin / manager / viewer (Password123!)
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  form;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const { username, password } = this.form.value;
    this.authService.login(username!, password!).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
