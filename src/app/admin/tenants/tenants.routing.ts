import { Routes } from '@angular/router';
import { TenantsComponent } from './tenants.component';

export const tenantsRoutes: Routes = [
  {
    path: '',
    component: TenantsComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./tenant-list/tenant-list.component').then(
            (c) => c.TenantListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./tenant-create/tenant-create.component').then(
            (c) => c.TenantCreateComponent
          ),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./tenant-details/tenant-details.component').then(
            (c) => c.TenantDetailsComponent
          ),
      },
    ],
  },
];
