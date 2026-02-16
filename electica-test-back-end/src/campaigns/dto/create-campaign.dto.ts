import { IsEnum, IsString, MinLength } from 'class-validator';
import { OptimizationGoal } from '../../enums/optimization-goal.enum';

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEnum(OptimizationGoal)
  strategy: OptimizationGoal;
}
