import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routing').then(
            (m) => m.usersRoutes
          ),
        data: {
          title: 'users',
        },
      },
      {
        path: 'tenants',
        loadChildren: () =>
          import('./tenants/tenants.routing').then(
            (m) => m.tenantsRoutes
          ),
        data: {
          title: 'users',
        },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routing').then(
            (m) => m.settingsRoutes
          ),
        data: {
          title: 'settings',
        },
      },
      
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/users',
      },
    ],
  },
];
