import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class DistributionScenariosDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  days?: number;
}
