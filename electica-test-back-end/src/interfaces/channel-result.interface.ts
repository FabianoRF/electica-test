import { ChannelType } from '../enums/channel-type.enum';

export interface ChannelResult {
  channel: ChannelType;
  budgetAllocated: number;
  percentage: number;
  estimatedReach: number;
  cpm: number;
}
