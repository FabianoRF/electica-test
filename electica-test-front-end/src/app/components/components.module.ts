import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeComponent } from './badge/badge.component';
import { BudgetCardComponent } from './budget-card/budget-card.component';
import { ScenarioPieChartComponent } from './scenario-pie-chart/scenario-pie-chart.component';

@NgModule({
  declarations: [
    BadgeComponent,
    BudgetCardComponent,
    ScenarioPieChartComponent,
  ],
  imports: [CommonModule],
  exports: [
    BadgeComponent,
    BudgetCardComponent,
    ScenarioPieChartComponent,
  ],
})
export class ComponentsModule {}
