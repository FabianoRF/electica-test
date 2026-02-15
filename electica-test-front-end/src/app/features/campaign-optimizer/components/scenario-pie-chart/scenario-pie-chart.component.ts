import { Component, computed, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';

import { BreakdownItem } from '../../models/optimization.models';

@Component({
  selector: 'app-scenario-pie-chart',
  imports: [NgxChartsModule],
  templateUrl: './scenario-pie-chart.component.html',
  styleUrl: './scenario-pie-chart.component.scss',
})
export class ScenarioPieChartComponent {
  protected readonly LegendPosition = LegendPosition;

  items = input<BreakdownItem[]>([]);

  chartResults = computed(() =>
    (this.items() ?? []).map((i) => ({
      name: i.channel,
      value: i.budgetAllocated,
    })),
  );
}
