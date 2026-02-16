import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { InMemoryCampaignRepository } from './repositories/in-memory-campaign.repository';
import { HardcodedStrategyProvider } from './providers/strategies/hardcoded-strategy.provider';
import { HardcodedCpmProvider } from './providers/cpm/hardcoded-cpm.provider';
import { HardcodedCsvProvider } from './providers/csv/hardcoded-csv.provider';
import {
  CAMPAIGN_REPOSITORY,
  CPM_PROVIDER,
  CSV_PROVIDER,
  STRATEGY_PROVIDER,
} from './tokens';

@Module({
  controllers: [CampaignsController],
  providers: [
    CampaignsService,
    { provide: CAMPAIGN_REPOSITORY, useClass: InMemoryCampaignRepository },
    { provide: STRATEGY_PROVIDER, useClass: HardcodedStrategyProvider },
    { provide: CPM_PROVIDER, useClass: HardcodedCpmProvider },
    { provide: CSV_PROVIDER, useClass: HardcodedCsvProvider },
  ],
  exports: [CampaignsService],
})
export class CampaignsModule {}
