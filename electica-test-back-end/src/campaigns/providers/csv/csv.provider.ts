import type { OptimizationScenariosResult } from '../../../interfaces/optimization-scenarios-result.interface';

export interface CsvProvider {
  generateCsv(scenarios: OptimizationScenariosResult): string;
}
