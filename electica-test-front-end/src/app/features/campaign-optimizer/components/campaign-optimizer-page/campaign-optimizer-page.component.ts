import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BudgetCardComponent } from '../budget-card/budget-card.component';
import { CampaignOptimizerService } from '../../services/campaign-optimizer.service';
import {
  OptimizationScenariosResult,
  OptimizationStrategyKey,
  OptimizationScenarioResult,
} from '../../models/optimization.models';

@Component({
  selector: 'app-campaign-optimizer-page',
  imports: [FormsModule, BudgetCardComponent],
  templateUrl: './campaign-optimizer-page.component.html',
  styleUrl: './campaign-optimizer-page.component.scss',
})
export class CampaignOptimizerPageComponent {
  private readonly service = inject(CampaignOptimizerService);

  totalBudget = signal<number>(100);
  days = signal<number>(30);
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<OptimizationScenariosResult | null>(null);

  selectedKey = signal<'maximize_reach' | 'balanced' | 'maximize_engagement' | null>(null);
  modalOpen = signal(false);
  campaignName = signal('');
  creating = signal(false);
  createError = signal<string | null>(null);

  scenarioCards = computed(() => {
    const res = this.results();
    if (!res)
      return [] as Array<{ key: OptimizationStrategyKey; data: OptimizationScenarioResult }>;

    return (
      Object.entries(res) as Array<[OptimizationStrategyKey, OptimizationScenarioResult]>
    ).map(([key, data]) => ({ key, data }));
  });

  canSubmit = computed(
    () =>
      Number.isFinite(this.totalBudget()) &&
      this.totalBudget() > 0 &&
      Number.isFinite(this.days()) &&
      this.days() > 0 &&
      !this.loading(),
  );

  openCreateModal(key: 'maximize_reach' | 'balanced' | 'maximize_engagement'): void {
    this.selectedKey.set(key);
    this.campaignName.set('');
    this.createError.set(null);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  canCreate = computed(() => this.campaignName().trim().length > 0 && !this.creating());

  createCampaign(): void {
    if (!this.canCreate()) return;

    this.creating.set(true);
    this.createError.set(null);
    const name = this.campaignName().trim();

    this.service.createCampaign(name).subscribe({
      next: () => {
        this.creating.set(false);
        this.modalOpen.set(false);
      },
      error: () => {
        this.creating.set(false);
        this.createError.set('Could not create campaign.');
      },
    });
  }

  optimize(): void {
    this.error.set(null);
    this.loading.set(true);

    this.service.getDistribution(this.totalBudget(), this.days()).subscribe({
      next: (res) => {
        this.results.set(res);
        this.selectedKey.set(null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not fetch distribution results.');
        this.loading.set(false);
      },
    });
  }
}
