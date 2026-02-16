/* eslint-disable @typescript-eslint/unbound-method */
import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelType } from '../enums/channel-type.enum';
import { OptimizationGoal } from '../enums/optimization-goal.enum';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
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

describe('CampaignsService', () => {
  let service: CampaignsService;
  let campaignRepository: jest.Mocked<CampaignRepository>;
  let strategyProvider: jest.Mocked<StrategyProvider>;
  let cpmProvider: jest.Mocked<CpmProvider>;
  let csvProvider: jest.Mocked<CsvProvider>;

  const mockStrategies = {
    [OptimizationGoal.MaximizeReach]: {
      title: 'Maximize reach',
      description: 'Best for broad awareness.',
      recommended: false,
      weights: {
        [ChannelType.Social]: 0.6,
        [ChannelType.Display]: 0.3,
        [ChannelType.Video]: 0.1,
      },
    },
    [OptimizationGoal.Balanced]: {
      title: 'Balanced strategy',
      description: 'A solid mix.',
      recommended: false,
      weights: {
        [ChannelType.Social]: 0.33,
        [ChannelType.Display]: 0.33,
        [ChannelType.Video]: 0.34,
      },
    },
    [OptimizationGoal.MaximizeEngagement]: {
      title: 'Maximize engagement',
      description: 'Video-heavy allocation.',
      recommended: true,
      weights: {
        [ChannelType.Social]: 0.1,
        [ChannelType.Display]: 0.3,
        [ChannelType.Video]: 0.6,
      },
    },
  };

  const mockCpmRates = {
    [ChannelType.Social]: {
      value: 4.5,
      title: 'Social',
      description: 'Low CPM, broad reach.',
    },
    [ChannelType.Display]: {
      value: 12.0,
      title: 'Display',
      description: 'Mid CPM, balanced reach.',
    },
    [ChannelType.Video]: {
      value: 24.0,
      title: 'Video',
      description: 'High CPM, higher impact.',
    },
  };

  beforeEach(async () => {
    const mockCampaignRepository: Partial<CampaignRepository> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const mockStrategyProvider: Partial<StrategyProvider> = {
      getStrategies: jest.fn().mockReturnValue(mockStrategies),
    };

    const mockCpmProvider: Partial<CpmProvider> = {
      getCpmRates: jest.fn().mockReturnValue(mockCpmRates),
    };

    const mockCsvProvider: Partial<CsvProvider> = {
      generateCsv: jest.fn().mockReturnValue('csv,data'),
      generateCampaignsCsv: jest.fn().mockReturnValue('id,name,strategy,date'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: CAMPAIGN_REPOSITORY, useValue: mockCampaignRepository },
        { provide: STRATEGY_PROVIDER, useValue: mockStrategyProvider },
        { provide: CPM_PROVIDER, useValue: mockCpmProvider },
        { provide: CSV_PROVIDER, useValue: mockCsvProvider },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    campaignRepository = module.get(CAMPAIGN_REPOSITORY);
    strategyProvider = module.get(STRATEGY_PROVIDER);
    cpmProvider = module.get(CPM_PROVIDER);
    csvProvider = module.get(CSV_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllDistributions', () => {
    it('should return distribution scenarios for all strategies', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });

      expect(strategyProvider.getStrategies).toHaveBeenCalled();
      expect(cpmProvider.getCpmRates).toHaveBeenCalled();
      expect(result).toHaveProperty(OptimizationGoal.MaximizeReach);
      expect(result).toHaveProperty(OptimizationGoal.Balanced);
      expect(result).toHaveProperty(OptimizationGoal.MaximizeEngagement);
    });

    it('should calculate correct budget per day', () => {
      const totalBudget = 9000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });

      expect(result[OptimizationGoal.MaximizeReach].budgetPerDay).toBe(300);
      expect(result[OptimizationGoal.Balanced].budgetPerDay).toBe(300);
      expect(result[OptimizationGoal.MaximizeEngagement].budgetPerDay).toBe(
        300,
      );
    });

    it('should use default days value of 30 when not provided', () => {
      const totalBudget = 6000;

      const result = service.getAllDistributions({ totalBudget });

      expect(result[OptimizationGoal.MaximizeReach].budgetPerDay).toBe(200);
    });

    it('should allocate budget correctly based on strategy weights', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });
      const maxReachScenario = result[OptimizationGoal.MaximizeReach];

      const socialAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Social,
      );
      const displayAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Display,
      );
      const videoAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Video,
      );

      expect(socialAllocation?.budgetAllocated).toBe(6000);
      expect(socialAllocation?.percentage).toBe(60);
      expect(displayAllocation?.budgetAllocated).toBe(3000);
      expect(displayAllocation?.percentage).toBe(30);
      expect(videoAllocation?.budgetAllocated).toBe(1000);
      expect(videoAllocation?.percentage).toBe(10);
    });

    it('should calculate estimated reach correctly', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });
      const maxReachScenario = result[OptimizationGoal.MaximizeReach];

      const socialAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Social,
      );

      const expectedReach = Math.floor((6000 / 4.5) * 1000);
      expect(socialAllocation?.estimatedReach).toBe(expectedReach);
    });

    it('should include CPM values in breakdown', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });
      const maxReachScenario = result[OptimizationGoal.MaximizeReach];

      const socialAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Social,
      );
      const displayAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Display,
      );
      const videoAllocation = maxReachScenario.breakdown.find(
        (b) => b.channel === ChannelType.Video,
      );

      expect(socialAllocation?.cpm).toBe(4.5);
      expect(displayAllocation?.cpm).toBe(12.0);
      expect(videoAllocation?.cpm).toBe(24.0);
    });

    it('should mark recommended strategy correctly', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });

      expect(result[OptimizationGoal.MaximizeEngagement].recommended).toBe(
        true,
      );
      expect(result[OptimizationGoal.MaximizeReach].recommended).toBe(false);
      expect(result[OptimizationGoal.Balanced].recommended).toBe(false);
    });

    it('should calculate total estimated reach for each scenario', () => {
      const totalBudget = 10000;
      const days = 30;

      const result = service.getAllDistributions({ totalBudget, days });
      const maxReachScenario = result[OptimizationGoal.MaximizeReach];

      const sumOfBreakdownReach = maxReachScenario.breakdown.reduce(
        (sum, item) => sum + item.estimatedReach,
        0,
      );

      expect(maxReachScenario.totalEstimatedReach).toBe(sumOfBreakdownReach);
    });
  });

  describe('createCampaign', () => {
    it('should call repository create with correct data', async () => {
      const campaignName = 'Test Campaign';
      const strategy = OptimizationGoal.MaximizeReach;
      const mockCampaign = new Campaign({
        id: '1',
        name: campaignName,
        strategy,
        createdAt: new Date(),
      });

      campaignRepository.create.mockResolvedValue(mockCampaign);

      const result = await service.createCampaign({
        name: campaignName,
        strategy,
      });

      expect(campaignRepository.create).toHaveBeenCalledWith({
        name: campaignName,
        strategy,
      });
      expect(result).toEqual(mockCampaign);
    });

    it('should return created campaign with strategy', async () => {
      const campaignName = 'Another Campaign';
      const strategy = OptimizationGoal.Balanced;
      const expectedCampaign = new Campaign({
        id: '2',
        name: campaignName,
        strategy,
        createdAt: new Date(),
      });

      campaignRepository.create.mockResolvedValue(expectedCampaign);

      const result = await service.createCampaign({
        name: campaignName,
        strategy,
      });

      expect(result.id).toBe('2');
      expect(result.name).toBe(campaignName);
      expect(result.strategy).toBe(strategy);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('exportCampaigns', () => {
    it('should call repository findAll and return StreamableFile', async () => {
      const mockCampaigns = [
        new Campaign({
          id: '1',
          name: 'Campaign 1',
          strategy: OptimizationGoal.MaximizeReach,
          createdAt: new Date(),
        }),
        new Campaign({
          id: '2',
          name: 'Campaign 2',
          strategy: OptimizationGoal.Balanced,
          createdAt: new Date(),
        }),
      ];
      const mockCsvData =
        'ID,Name,Strategy,Created At\n1,Campaign 1,maximize_reach,2024-01-01';

      campaignRepository.findAll.mockResolvedValue(mockCampaigns);
      csvProvider.generateCampaignsCsv.mockReturnValue(mockCsvData);

      const result = await service.exportCampaigns();

      expect(campaignRepository.findAll).toHaveBeenCalled();
      expect(csvProvider.generateCampaignsCsv).toHaveBeenCalledWith(
        mockCampaigns,
      );
      expect(result).toBeInstanceOf(StreamableFile);
    });

    it('should generate CSV from campaigns list', async () => {
      const mockCampaigns = [
        new Campaign({
          id: '3',
          name: 'Test Campaign',
          strategy: OptimizationGoal.MaximizeEngagement,
          createdAt: new Date(),
        }),
      ];

      campaignRepository.findAll.mockResolvedValue(mockCampaigns);
      csvProvider.generateCampaignsCsv.mockReturnValue('csv,data');

      await service.exportCampaigns();

      expect(csvProvider.generateCampaignsCsv).toHaveBeenCalledWith(
        mockCampaigns,
      );
    });
  });
});
