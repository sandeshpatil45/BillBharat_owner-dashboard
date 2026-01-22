import api from './api';
import type { SalesPerformance, SalesFilters, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const salesService = {
  // Get sales performance data
  getSalesPerformance: async (filters?: SalesFilters): Promise<SalesPerformance[]> => {
    try {
      const response = await api.get<ApiResponse<SalesPerformance[]>>(
        API_ENDPOINTS.SALES.PERFORMANCE,
        { params: filters }
      );
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch sales performance');
    }
  },

  // Export sales data to CSV
  exportSales: async (filters?: SalesFilters): Promise<Blob> => {
    try {
      const response = await api.get(API_ENDPOINTS.SALES.EXPORT, {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export sales data');
    }
  },
};
