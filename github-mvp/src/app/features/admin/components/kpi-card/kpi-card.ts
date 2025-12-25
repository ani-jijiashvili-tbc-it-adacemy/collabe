import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  readonly icon = input.required<string>();
  readonly value = input.required<number | string>();
  readonly label = input.required<string>();
  readonly change = input.required<number>();
  readonly subtitle = input.required<string>();
}
