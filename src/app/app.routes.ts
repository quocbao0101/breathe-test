import { Route } from '@angular/router';
import { CanAuthGuard } from './helpers/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routing').then((m) => m.adminRoutes),
    canActivate: [CanAuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot',
    loadComponent: () =>
      import('./forgot/forgot.component').then((m) => m.ForgotComponent),
  },
  {
    path: 'change-pass',
    loadComponent: () =>
      import('./forgot/changePass/changPass.component').then((m) => m.ChangPassComponent),
  },
  {
    path: 'no-permission',
    loadComponent: () =>
      import('./error/containers/permission-denied/permission-denied-page.component').then((m) => m.PermissionDeniedPageComponent),
  },
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./error/containers/not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent),
  },
];
