import { OptimizationGoal } from '../../enums/optimization-goal.enum';

export class Campaign {
  id: string;
  name: string;
  strategy: OptimizationGoal;
  createdAt: Date;

  constructor(data: {
    id: string;
    name: string;
    strategy: OptimizationGoal;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.strategy = data.strategy;
    this.createdAt = data.createdAt;
  }
}
