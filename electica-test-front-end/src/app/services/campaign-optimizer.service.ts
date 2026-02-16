import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OptimizationScenariosResult } from '../models/optimization.models';

@Injectable({
  providedIn: 'root',
})
export class CampaignOptimizerService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3000';

  getDistribution(totalBudget: number, days: number): Observable<OptimizationScenariosResult> {
    const params = new HttpParams()
      .set('totalBudget', String(totalBudget))
      .set('days', String(days));
    return this.http.get<OptimizationScenariosResult>(`${this.baseUrl}/campaign/distribution`, {
      params,
    });
  }

  createCampaign(name: string): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.baseUrl}/campaign`, { name });
  }

  exportCsv(totalBudget: number, days: number): Observable<Blob> {
    const params = new HttpParams()
      .set('totalBudget', String(totalBudget))
      .set('days', String(days));
    return this.http.get(`${this.baseUrl}/campaign/export`, {
      params,
      responseType: 'blob',
    });
  }
}
