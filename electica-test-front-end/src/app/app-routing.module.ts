import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignOptimizerComponent } from './pages/campaign-optimizer/campaign-optimizer.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignOptimizerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
