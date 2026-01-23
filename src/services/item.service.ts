import api from './api';
import type { ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const itemService = {
  // Get all items for this business
  getItems: async (filters?: any): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.ITEMS.LIST,
        { params: filters }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch items');
    }
  },

  // Get low stock items
  getLowStockItems: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.ITEMS.LOW_STOCK
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch low stock items');
    }
  },

  // Get fast-moving items
  getFastMovingItems: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.ITEMS.FAST_MOVING
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch fast-moving items');
    }
  },
};
