import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { CampaignOptimizerComponent } from './campaign-optimizer.component';

@NgModule({
  declarations: [CampaignOptimizerComponent],
  imports: [SharedModule, FormsModule, ComponentsModule],
  exports: [CampaignOptimizerComponent],
})
export class CampaignOptimizerModule {}
