import api from './api';
import type { Subscription, SubscriptionFilters, PaginatedResponse, ApiResponse, Plan } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const subscriptionService = {
  // Get current active subscription
  getCurrentSubscription: async (): Promise<Subscription> => {
    try {
      const response = await api.get<ApiResponse<Subscription>>(
        API_ENDPOINTS.SUBSCRIPTIONS.CURRENT
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch current subscription');
    }
  },

  // Start free trial
  startTrial: async (trialData: any): Promise<Subscription> => {
    try {
      const response = await api.post<ApiResponse<Subscription>>(
        API_ENDPOINTS.SUBSCRIPTIONS.START_TRIAL,
        trialData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to start trial');
    }
  },

  // Create paid subscription
  createSubscription: async (subscriptionData: any): Promise<Subscription> => {
    try {
      const response = await api.post<ApiResponse<Subscription>>(
        API_ENDPOINTS.SUBSCRIPTIONS.CREATE,
        subscriptionData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create subscription');
    }
  },

  // Upgrade subscription plan
  upgradeSubscription: async (upgradeData: { subscriptionId: string; newPlanCode: string; [key: string]: any }): Promise<Subscription> => {
    try {
      const response = await api.post<ApiResponse<Subscription>>(
        API_ENDPOINTS.SUBSCRIPTIONS.UPGRADE,
        upgradeData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upgrade subscription');
    }
  },

  // Get billing history
  getBillingHistory: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.SUBSCRIPTIONS.BILLING_HISTORY
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch billing history');
    }
  },

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
  getPlans: async (businessType?: 'KIRANA' | 'RESTAURANT'): Promise<Plan[]> => {
    try {
      const params = businessType ? { businessType } : {};
      const response = await api.get<ApiResponse<Plan[]>>(
        API_ENDPOINTS.PLANS.LIST,
        { params }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch plans');
    }
  },

  // Get plan by ID
  getPlanById: async (id: string): Promise<Plan> => {
    try {
      const response = await api.get<ApiResponse<Plan>>(
        API_ENDPOINTS.PLANS.DETAIL(id)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch plan details');
    }
  },
};
