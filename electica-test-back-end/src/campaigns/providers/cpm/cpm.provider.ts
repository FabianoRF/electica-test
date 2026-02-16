import { ChannelType } from '../../../enums/channel-type.enum';

export interface CpmRateInfo {
  value: number;
  title: string;
  description: string;
}

export interface CpmProvider {
  getCpmRates(): Record<ChannelType, CpmRateInfo>;
}
