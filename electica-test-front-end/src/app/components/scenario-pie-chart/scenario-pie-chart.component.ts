import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  Injector,
  input,
  inject,
  viewChild,
} from '@angular/core';

import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { BreakdownItem } from '../../models/optimization.models';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-scenario-pie-chart',
  standalone: false,
  templateUrl: './scenario-pie-chart.component.html',
  styleUrl: './scenario-pie-chart.component.scss',
})
export class ScenarioPieChartComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  items = input<BreakdownItem[]>([]);

  private chart: Chart<'doughnut'> | null = null;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvas().nativeElement, {
      type: 'doughnut',
      data: this.buildData(),
      options: this.buildOptions(),
    });

    this.destroyRef.onDestroy(() => {
      this.chart?.destroy();
      this.chart = null;
    });

    effect(
      () => {
        const nextData = this.buildData();
        if (!this.chart) return;

        this.chart.data.labels = nextData.labels;
        this.chart.data.datasets[0].data = nextData.datasets[0].data;
        this.chart.data.datasets[0].backgroundColor = nextData.datasets[0].backgroundColor;
        this.chart.update();
      },
      { injector: this.injector },
    );
  }

  private buildData(): ChartData<'doughnut'> {
    const items = this.items() ?? [];

    const labels = items.map((i) => i.channel);
    const values = items.map((i) => i.budgetAllocated);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#60A5FA', '#2563EB', '#1E3A8A'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }

  private buildOptions(): ChartOptions<'doughnut'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: 700,
          },
          formatter: (_value, context) =>
            String(context.chart.data.labels?.[context.dataIndex] ?? ''),
        },
      },
    };
  }
}
