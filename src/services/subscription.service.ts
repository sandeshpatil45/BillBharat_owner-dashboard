import api from './api';
import type { Subscription, SubscriptionFilters, PaginatedResponse, ApiResponse, Plan } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const subscriptionService = {
  // Get all subscriptions with filters and pagination
  getSubscriptions: async (
    filters?: SubscriptionFilters,
    page: number = 1,
    pageSize: number = 25
  ): Promise<PaginatedResponse<Subscription>> => {
    try {
      const params = {
        page,
        pageSize,
        ...filters,
      };
      
      const response = await api.get<ApiResponse<PaginatedResponse<Subscription>>>(
        API_ENDPOINTS.SUBSCRIPTIONS.LIST,
        { params }
      );
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch subscriptions');
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (id: string): Promise<Subscription> => {
    try {
      const response = await api.get<ApiResponse<Subscription>>(
        API_ENDPOINTS.SUBSCRIPTIONS.DETAIL(id)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch subscription details');
    }
  },

  // Export subscriptions to CSV
  exportSubscriptions: async (filters?: SubscriptionFilters): Promise<Blob> => {
    try {
      const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS.EXPORT, {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export subscriptions');
    }
  },

  // Get all plans
  getPlans: async (): Promise<Plan[]> => {
    try {
      const response = await api.get<ApiResponse<Plan[]>>('/plans');
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },
};
