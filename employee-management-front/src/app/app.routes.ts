import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { EmployeesComponent } from './pages/employees/employees';
import { DepartmentsComponent } from './pages/departments/departments';
import { AccessRequestsComponent } from './pages/access-requests/access-requests';
import { authGuard } from './core/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'access-requests',
    component: AccessRequestsComponent,
    canActivate: [authGuard]
  }
];
