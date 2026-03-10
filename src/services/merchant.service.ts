import api from './api';
import type {
  MerchantListItem,
  MerchantDetail,
  MerchantStats,
  MerchantFilters,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const merchantService = {
  // Get merchant statistics
  getStats: async (): Promise<MerchantStats> => {
    try {
      const response = await api.get<ApiResponse<MerchantStats>>(
        API_ENDPOINTS.MERCHANTS.STATS
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch merchant stats');
    }
  },

  // Get merchant list with filters
  getMerchants: async (
    filters?: MerchantFilters,
    page: number = 1,
    pageSize: number = 25
  ): Promise<PaginatedResponse<MerchantListItem>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<MerchantListItem>>>(
        API_ENDPOINTS.MERCHANTS.LIST,
        {
          params: {
            ...filters,
            page,
            pageSize,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch merchants');
    }
  },

  // Get merchant detail by ID
  getMerchantDetail: async (id: string): Promise<MerchantDetail> => {
    try {
      const response = await api.get<ApiResponse<MerchantDetail>>(
        API_ENDPOINTS.MERCHANTS.DETAIL(id)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch merchant detail');
    }
  },

  // Call merchant (trigger action)
  callMerchant: async (id: string, phone: string): Promise<void> => {
    try {
      // This would trigger a call via communication service
      console.log(`Calling merchant ${id} at ${phone}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initiate call');
    }
  },

  // Send WhatsApp message
  sendWhatsApp: async (id: string, phone: string, message?: string): Promise<void> => {
    try {
      // This would trigger WhatsApp message
      console.log(`Sending WhatsApp to merchant ${id} at ${phone}`, message);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send WhatsApp');
    }
  },

  // Deactivate merchant
  deactivateMerchant: async (id: string): Promise<void> => {
    try {
      await api.post(`${API_ENDPOINTS.MERCHANTS.DETAIL(id)}/deactivate`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to deactivate merchant');
    }
  },
};
