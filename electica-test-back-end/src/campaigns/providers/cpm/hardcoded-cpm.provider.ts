import { ChannelType } from '../../../enums/channel-type.enum';
import { CpmProvider } from './cpm.provider';

export class HardcodedCpmProvider implements CpmProvider {
  getCpmRates() {
    return {
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
  }
}
