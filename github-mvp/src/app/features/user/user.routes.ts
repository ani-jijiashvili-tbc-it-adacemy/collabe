import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const userRoutes: Routes = [
  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/user-layout/user-layout').then(
        (m) => m.UserLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./containers/home-page/home-page').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./containers/browse-events-page/browse-events-page').then(
            (m) => m.BrowseEventsPageComponent
          ),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./containers/event-detail-page/event-detail-page').then(
            (m) => m.EventDetailPageComponent
          ),
      },
      {
        path: 'my-registrations',
        loadComponent: () =>
          import('./containers/my-registrations-page/my-registrations-page').then(
            (m) => m.MyRegistrationsPageComponent
          ),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./containers/notifications-page/notifications-page').then(
            (m) => m.NotificationsPageComponent
          ),
      },
    ],
  },
];