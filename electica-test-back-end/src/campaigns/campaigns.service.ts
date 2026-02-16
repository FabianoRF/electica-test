import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ChannelType } from '../enums/channel-type.enum';
import { OptimizationGoal } from '../enums/optimization-goal.enum';
import { ChannelResult } from '../interfaces/channel-result.interface';
import { OptimizationScenario } from '../interfaces/optimization-scenario.interface';
import { OptimizationScenariosResult } from '../interfaces/optimization-scenarios-result.interface';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { DistributionScenariosDto } from './dto/distribution-scenarios.dto';
import type { CampaignRepository } from './repositories/campaign.repository';
import type { CpmProvider } from './providers/cpm/cpm.provider';
import type { StrategyProvider } from './providers/strategies/strategy-provider';
import type { CsvProvider } from './providers/csv/csv.provider';
import {
  CAMPAIGN_REPOSITORY,
  CPM_PROVIDER,
  CSV_PROVIDER,
  STRATEGY_PROVIDER,
} from './tokens';

@Injectable()
export class CampaignsService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: CampaignRepository,
    @Inject(STRATEGY_PROVIDER)
    private readonly strategyProvider: StrategyProvider,
    @Inject(CPM_PROVIDER) private readonly cpmProvider: CpmProvider,
    @Inject(CSV_PROVIDER) private readonly csvProvider: CsvProvider,
  ) {}

  getAllDistributions({
    totalBudget,
    days,
  }: DistributionScenariosDto): OptimizationScenariosResult {
    const strategies = this.strategyProvider.getStrategies();
    const cpmRates = this.cpmProvider.getCpmRates();
    const scenarios = {} as OptimizationScenariosResult;

    const totalDays = days ?? 30;
    const budgetPerDay = Number((totalBudget / totalDays).toFixed(2));

    for (const [strategy, strategyInfo] of Object.entries(strategies)) {
      const breakdown: ChannelResult[] = [];
      let totalEstimatedReach = 0;

      const weights = strategyInfo.weights;

      for (const [channel, weight] of Object.entries(weights) as Array<
        [ChannelType, number]
      >) {
        const allocation = totalBudget * weight;
        const cpm = cpmRates[channel].value;
        const estimatedReach = Math.floor((allocation / cpm) * 1000);

        breakdown.push({
          channel,
          budgetAllocated: Math.round(allocation * 100) / 100,
          percentage: weight * 100,
          estimatedReach,
          cpm,
        });

        totalEstimatedReach += estimatedReach;
      }

      const scenario: OptimizationScenario = {
        strategy: strategy as OptimizationGoal,
        title: strategyInfo.title,
        description: strategyInfo.description,
        totalBudget,
        budgetPerDay,
        recommended: strategyInfo.recommended,
        totalEstimatedReach,
        breakdown,
      };

      scenarios[strategy] = scenario;
    }

    return scenarios;
  }

  async createCampaign({ name }: CreateCampaignDto) {
    return this.campaignRepository.create({ name });
  }

  exportCsv(dto: DistributionScenariosDto): StreamableFile {
    const scenarios = this.getAllDistributions(dto);
    const csv = this.csvProvider.generateCsv(scenarios);
    const buffer = Buffer.from(csv, 'utf-8');
    return new StreamableFile(buffer);
  }
}
