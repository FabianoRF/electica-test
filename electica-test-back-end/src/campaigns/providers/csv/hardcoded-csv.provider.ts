import { Injectable } from '@nestjs/common';
import type { OptimizationScenariosResult } from '../../../interfaces/optimization-scenarios-result.interface';
import type { CsvProvider } from './csv.provider';

@Injectable()
export class HardcodedCsvProvider implements CsvProvider {
  generateCsv(scenarios: OptimizationScenariosResult): string {
    const header =
      'Strategy,Channel,Budget Allocated,Percentage,Estimated Reach,CPM\n';

    const rows = Object.entries(scenarios)
      .flatMap(([strategy, scenario]) =>
        scenario.breakdown.map(
          (item) =>
            `${strategy},${item.channel},${item.budgetAllocated},${item.percentage},${item.estimatedReach},${item.cpm}`,
        ),
      )
      .join('\n');

    return header + rows;
  }
}
