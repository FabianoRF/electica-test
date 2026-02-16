import { OptimizationGoal } from '../enums/optimization-goal.enum';
import { OptimizationScenario } from './optimization-scenario.interface';

export type OptimizationScenariosResult = Record<
  OptimizationGoal,
  OptimizationScenario
>;
