import { Component, EventEmitter, input, Output } from '@angular/core';

import { OptimizationScenarioResult } from '../../models/optimization.models';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-budget-card',
  standalone: false,
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.scss',
})
export class BudgetCardComponent {
  title = input.required<string>();
  description = input<string>('');
  isRecommended = input<boolean>(false);
  isSelected = input<boolean>(false);
  data = input<OptimizationScenarioResult | null>(null);

  @Output() selectCard = new EventEmitter<void>();
}
