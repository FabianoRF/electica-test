import { ChannelType } from '../../../enums/channel-type.enum';
import { OptimizationGoal } from '../../../enums/optimization-goal.enum';
import { StrategyProvider } from './strategy-provider';

export class HardcodedStrategyProvider implements StrategyProvider {
  getStrategies() {
    return {
      [OptimizationGoal.MaximizeReach]: {
        title: 'Maximize reach',
        description: 'Best for broad awareness. Social-first allocation.',
        recommended: false,
        weights: {
          [ChannelType.Social]: 0.6,
          [ChannelType.Display]: 0.3,
          [ChannelType.Video]: 0.1,
        },
      },
      [OptimizationGoal.Balanced]: {
        title: 'Balanced strategy',
        description: 'A solid mix between volume and quality.',
        recommended: false,
        weights: {
          [ChannelType.Social]: 0.33,
          [ChannelType.Display]: 0.33,
          [ChannelType.Video]: 0.34,
        },
      },
      [OptimizationGoal.MaximizeEngagement]: {
        title: 'Maximize engagement',
        description: 'Video-heavy allocation. Lower reach, higher impact.',
        recommended: true,
        weights: {
          [ChannelType.Social]: 0.1,
          [ChannelType.Display]: 0.3,
          [ChannelType.Video]: 0.6,
        },
      },
    };
  }
}
