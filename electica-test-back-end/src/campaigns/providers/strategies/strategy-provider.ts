import { ChannelType } from '../../../enums/channel-type.enum';
import { OptimizationGoal } from '../../../enums/optimization-goal.enum';

export type StrategyWeights = Record<ChannelType, number>;

export interface StrategyInfo {
  title: string;
  description: string;
  weights: StrategyWeights;
  recommended: boolean;
}

export interface StrategyProvider {
  getStrategies(): Record<OptimizationGoal, StrategyInfo>;
}
