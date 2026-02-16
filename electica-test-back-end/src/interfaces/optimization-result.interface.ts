import { ChannelResult } from './channel-result.interface';

export interface OptimizationResult {
  totalBudget: number;
  totalEstimatedReach: number;
  breakdown: ChannelResult[];
}
