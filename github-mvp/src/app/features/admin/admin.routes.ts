import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    // canActivate: [adminGuard],
    loadComponent: () =>
      import('./containers/admin-layout/admin-layout').then(
        (m) => m.AdminLayout
      ), 
    children: [
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full',
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./containers/event-management-page/event-management-page').then(
            (m) => m.EventManagementPage
          ),
        data: { title: 'Event Management' },
      },
      {
        path: 'events/create',
        loadComponent: () =>
          import('./containers/create-event-page/create-event-page').then(
            (m) => m.CreateEventPage
          ),
        data: { title: 'Create Event' },
      },
      {
        path: 'events/:id/edit',
        loadComponent: () =>
          import('./containers/create-event-page/create-event-page').then(
            (m) => m.CreateEventPage
          ),
        data: { title: 'Edit Event' },
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./containers/event-details-page/event-details-page').then(
            (m) => m.EventDetailsPage
          ),
        data: { title: 'Event Details' },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./containers/analytics-page/analytics-page').then(
            (m) => m.AnalyticsPage
          ),
        data: { title: 'Analytics Dashboard' },
      },
    ],
  },
];