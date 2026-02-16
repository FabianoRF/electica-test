import type { OptimizationScenariosResult } from '../../../interfaces/optimization-scenarios-result.interface';
import type { Campaign } from '../../entities/campaign.entity';

export interface CsvProvider {
  generateCsv(scenarios: OptimizationScenariosResult): string;
  generateCampaignsCsv(campaigns: Campaign[]): string;
}
