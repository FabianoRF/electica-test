import { OptimizationGoal } from '../../enums/optimization-goal.enum';
import { Campaign } from '../entities/campaign.entity';

export interface CampaignRepository {
  create(data: { name: string; strategy: OptimizationGoal }): Promise<Campaign>;
  findAll(): Promise<Campaign[]>;
  findById(id: string): Promise<Campaign | null>;
}
