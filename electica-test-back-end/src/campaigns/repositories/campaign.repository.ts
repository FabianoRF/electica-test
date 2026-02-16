import { Campaign } from '../entities/campaign.entity';

export interface CampaignRepository {
  create(data: { name: string }): Promise<Campaign>;
  findAll(): Promise<Campaign[]>;
  findById(id: string): Promise<Campaign | null>;
}
