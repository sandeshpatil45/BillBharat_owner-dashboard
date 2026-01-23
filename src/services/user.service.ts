import api from './api';
import type { ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  // Validate user eligibility for plan upgrade/trial
  checkEligibility: async (businessType: 'KIRANA' | 'RESTAURANT'): Promise<any> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        API_ENDPOINTS.USER.ELIGIBILITY,
        { businessType }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to check eligibility');
    }
  },
};
