import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/service/auth';
import { RouterModule } from '@angular/router';
import { isOrganizer as checkIsOrganizer } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);

  readonly userName = computed(() => this.authService.user()?.name || 'Guest');
  readonly userRole = computed(() => this.authService.user()?.role || '');
  readonly userAvatar = signal('https://static.thenounproject.com/png/363640-200.png');
  readonly isOrganizer = computed(() => checkIsOrganizer(this.authService.user()));
  readonly notificationCount = signal(3);
  readonly mobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}