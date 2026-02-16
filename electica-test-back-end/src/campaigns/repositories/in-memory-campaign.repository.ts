import { Campaign } from '../entities/campaign.entity';
import { CampaignRepository } from './campaign.repository';

export class InMemoryCampaignRepository implements CampaignRepository {
  private campaigns: Campaign[] = [];
  private seq = 1;

  create(data: { name: string }): Promise<Campaign> {
    const campaign = new Campaign({
      id: String(this.seq++),
      name: data.name,
      createdAt: new Date(),
    });

    this.campaigns = [campaign, ...this.campaigns];
    return Promise.resolve(campaign);
  }

  findAll(): Promise<Campaign[]> {
    return Promise.resolve([...this.campaigns]);
  }

  findById(id: string): Promise<Campaign | null> {
    return Promise.resolve(this.campaigns.find((c) => c.id === id) ?? null);
  }
}
