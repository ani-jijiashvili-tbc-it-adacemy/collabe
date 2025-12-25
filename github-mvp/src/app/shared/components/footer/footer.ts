import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  readonly currentYear = signal<number>(new Date().getFullYear());
  
  readonly quickLinks = signal<Link[]>([
    { label: 'Browse Events', url: '/browse-events' },
    { label: 'My Registrations', url: '/my-registrations' },
    { label: 'Calendar View', url: '/calendar' },
    { label: 'Past Events', url: '/past-events' }
  ]);

  readonly categories = signal<Link[]>([
    { label: 'Team Building', url: '/categories/team-building' },
    { label: 'Workshops', url: '/categories/workshops' },
    { label: 'Sports', url: '/categories/sports' },
    { label: 'Cultural Events', url: '/categories/cultural-events' }
  ]);

  readonly support = signal<Link[]>([
    { label: 'Help Center', url: '/help' },
    { label: 'Contact', url: '/contact' },
    { label: 'FAQs', url: '/faqs' },
    { label: 'Guidelines', url: '/guidelines' }
  ]);

  readonly socialLinks = signal<Array<{ icon: string; url: string; ariaLabel: string }>>([
    { icon: 'pi pi-linkedin', url: 'https://linkedin.com', ariaLabel: 'LinkedIn' },
    { icon: 'pi pi-twitter', url: 'https://twitter.com', ariaLabel: 'Twitter' },
    { icon: 'pi pi-facebook', url: 'https://facebook.com', ariaLabel: 'Facebook' }
  ]);

  readonly footerLinks = signal<Link[]>([
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Service', url: '/terms-of-service' },
    { label: 'Cookie Settings', url: '/cookie-settings' }
  ]);
}
