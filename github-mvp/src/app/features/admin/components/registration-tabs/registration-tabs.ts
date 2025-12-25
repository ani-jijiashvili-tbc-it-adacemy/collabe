import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RegistrationTab } from '../../models/registration.model';

@Component({
  selector: 'app-registration-tabs',
  imports: [CommonModule],
  templateUrl: './registration-tabs.html',
  styleUrl: './registration-tabs.scss',
})
export class RegistrationTabs {
   readonly activeTab = input.required<RegistrationTab>();
  readonly registeredCount = input.required<number>();
  readonly waitlistCount = input.required<number>();
  readonly cancelledCount = input.required<number>();
  
  readonly tabChange = output<RegistrationTab>();

  readonly tabs = computed(() => [
    {
      key: 'registered' as RegistrationTab,
      label: 'Registered Participants',
      count: this.registeredCount()
    },
    {
      key: 'waitlist' as RegistrationTab,
      label: 'Waitlist',
      count: this.waitlistCount()
    },
    {
      key: 'cancelled' as RegistrationTab,
      label: 'Cancelled',
      count: this.cancelledCount()
    }
  ]);

  onTabClick(tab: RegistrationTab): void {
    if (tab !== this.activeTab()) {
      this.tabChange.emit(tab);
    }
  }

  isActive(tab: RegistrationTab): boolean {
    return this.activeTab() === tab;
  }

}
