import { OptimizationGoal } from '../enums/optimization-goal.enum';
import { ChannelResult } from './channel-result.interface';

export interface OptimizationScenario {
  strategy: OptimizationGoal;
  title: string;
  description: string;
  totalBudget: number;
  budgetPerDay: number;
  recommended: boolean;
  totalEstimatedReach: number;
  breakdown: ChannelResult[];
}
