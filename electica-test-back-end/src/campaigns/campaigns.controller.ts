import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { DistributionScenariosDto } from './dto/distribution-scenarios.dto';

@Controller('campaign')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('distribution')
  distribute(@Query() distributeDto: DistributionScenariosDto) {
    return this.campaignsService.getAllDistributions(distributeDto);
  }

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.createCampaign(createCampaignDto);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="campaigns.csv"')
  exportCampaigns(): Promise<StreamableFile> {
    return this.campaignsService.exportCampaigns();
  }
}
