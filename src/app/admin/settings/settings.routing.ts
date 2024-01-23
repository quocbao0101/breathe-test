import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'sample-images',
        loadComponent: () =>
          import('./sample-images/sample-images.component').then(
            (c) => c.SampleImagesComponent
          ),
      },
      {
        path: 'guide/website',
        loadComponent: () =>
          import('./guide/website/guide-website.component').then(
            (c) => c.GuideWebsiteComponent
          ),
      },
      {
        path: 'guide/mobile',
        loadComponent: () =>
          import('./guide/mobile/guide-mobile.component').then(
            (c) => c.GuideMobileComponent
          ),
      },
      {
        path: 'guide',
        redirectTo: 'guide/website',
        pathMatch: 'full',
      },
      {
        path: 'support-contact',
        loadComponent: () =>
          import('./support-contact/support-contact.component').then(
            (c) => c.SupportContactComponent
          ),
      },
      {
        path: 'resource-management',
        loadComponent: () =>
          import('./resource-management/resource-management.component').then(
            (c) => c.ResourceManagementComponent
          ),
      },
      {
        path: 'notification-template',
        loadComponent: () =>
          import('./notification-template/notification-template.component').then(
            (c) => c.NotificationTemplateComponent
          ),
      },
      {
        path: '',
        redirectTo: 'sample-images',
        pathMatch: 'full',
      },
    ],
  },
];
