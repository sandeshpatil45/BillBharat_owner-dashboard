import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { RenewalData, RenewalPipeline, RenewalAction } from '../types';

export const renewalService = {
  // Get renewal pipeline data
  async getRenewalData(): Promise<RenewalData> {
    const response = await api.get<RenewalData>(API_ENDPOINTS.RENEWALS.PIPELINE);
    return response.data;
  },

  // Get renewal pipeline
  async getPipeline(): Promise<RenewalPipeline> {
    const response = await api.get<RenewalPipeline>(API_ENDPOINTS.RENEWALS.PIPELINE);
    return response.data;
  },

  // Get renewal actions
  async getActions(): Promise<RenewalAction[]> {
    const response = await api.get<RenewalAction[]>(API_ENDPOINTS.RENEWALS.ACTIONS);
    return response.data;
  },

  // Configure renewal reminder settings
  async configureReminders(settings: any): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>(
      '/api/renewals/configure',
      settings
    );
    return response.data;
  },
};
