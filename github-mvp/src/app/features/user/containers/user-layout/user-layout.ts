import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/service/auth';
import { Header } from '../../../../shared/components/header/header';
import { Footer } from '../../../../shared/components/footer/footer';


@Component({
  selector: 'app-user-layout',
  imports: [RouterModule, Header,Footer],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly userName = computed(() => this.authService.user()?.name || 'Guest');
  readonly userRole = computed(() => this.authService.user()?.role || 'Employee');
  readonly userAvatar = signal('https://static.thenounproject.com/png/363640-200.png');
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