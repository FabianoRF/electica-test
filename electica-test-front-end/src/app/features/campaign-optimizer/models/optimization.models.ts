export type OptimizationStrategyKey = 'maximize_reach' | 'maximize_engagement' | 'balanced';

export interface BreakdownItem {
  channel: string;
  budgetAllocated: number;
  percentage: number;
  estimatedReach: number;
  cpm: number;
}

export interface OptimizationScenarioResult {
  strategy: string;
  title: string;
  description: string;
  totalBudget: number;
  budgetPerDay: number;
  recommended: boolean;
  totalEstimatedReach: number;
  breakdown: BreakdownItem[];
}

export type OptimizationScenariosResult = Record<
  OptimizationStrategyKey,
  OptimizationScenarioResult
>;
