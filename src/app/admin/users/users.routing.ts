import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';

export const usersRoutes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./user-details/user-details.component').then(
            (c) => c.UserDetailsComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./user-list/user-list.component').then(
            (c) => c.UserListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./user-add/user-add.component').then(
            (c) => c.UserAddComponent
          ),
      }
  ]
  },
];
