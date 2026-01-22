import api from './api';
import type { 
  DashboardKPIs, 
  CustomerGrowthData, 
  ChartData, 
  RevenueReport, 
  PlanDistribution,
  ApiResponse 
} from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const reportService = {
  // Get dashboard KPIs
  getDashboardKPIs: async (): Promise<DashboardKPIs> => {
    try {
      const response = await api.get<ApiResponse<DashboardKPIs>>(
        API_ENDPOINTS.REPORTS.DASHBOARD_KPIS
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch dashboard KPIs');
    }
  },

  // Get customer growth data (last 30 days)
  getCustomerGrowth: async (days: number = 30): Promise<CustomerGrowthData[]> => {
    try {
      const response = await api.get<ApiResponse<CustomerGrowthData[]>>(
        API_ENDPOINTS.REPORTS.CUSTOMER_GROWTH,
        { params: { days } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch customer growth data');
    }
  },

  // Get subscription distribution (active vs expired)
  getSubscriptionDistribution: async (): Promise<ChartData[]> => {
    try {
      const response = await api.get<ApiResponse<ChartData[]>>(
        '/reports/subscription-distribution'
      );
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },

  // Get business type distribution
  getBusinessTypeDistribution: async (): Promise<ChartData[]> => {
    try {
      const response = await api.get<ApiResponse<ChartData[]>>(
        '/reports/business-type-distribution'
      );
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },

  // Get revenue report
  getRevenueReport: async (): Promise<RevenueReport> => {
    try {
      const response = await api.get<ApiResponse<RevenueReport>>(
        API_ENDPOINTS.REPORTS.REVENUE
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch revenue report');
    }
  },

  // Get plan distribution
  getPlanDistribution: async (): Promise<PlanDistribution[]> => {
    try {
      const response = await api.get<ApiResponse<PlanDistribution[]>>(
        API_ENDPOINTS.REPORTS.PLAN_DISTRIBUTION
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch plan distribution');
    }
  },

  // Get revenue trend (last 6 months)
  getRevenueTrend: async (months: number = 6): Promise<ChartData[]> => {
    try {
      const response = await api.get<ApiResponse<ChartData[]>>(
        '/reports/revenue-trend',
        { params: { months } }
      );
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },
};
