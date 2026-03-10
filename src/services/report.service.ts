import api from './api';
import type { 
  DashboardKPIs, 
  CustomerGrowthData, 
  ChartData, 
  RevenueReport, 
  PlanDistribution,
  HomeDashboardData,
  SalesTrendData,
  DashboardAlert,
  FinanceData,
  SalesTeamData,
  ExecutiveDetail,
  ApiResponse 
} from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const reportService = {
  // Get today's sales summary
  getTodaySales: async (): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.REPORTS.TODAY_SALES
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch today sales');
    }
  },

  // Get monthly sales summary
  getMonthlySales: async (): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.REPORTS.MONTHLY_SALES
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch monthly sales');
    }
  },

  // Get sales for selected period
  getSalesByDateRange: async (startDate: string, endDate: string): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.REPORTS.SALES,
        { params: { startDate, endDate } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch sales for date range');
    }
  },

  // Get staff performance (restaurant only)
  getStaffPerformance: async (filters?: any): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.REPORTS.STAFF_PERFORMANCE,
        { params: filters }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch staff performance');
    }
  },

  // Get sales report with filters
  getSalesReport: async (filters?: any): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.REPORTS.SALES_REPORT,
        { params: filters }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch sales report');
    }
  },

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

  // Get home dashboard data (command center KPIs)
  getHomeDashboard: async (): Promise<HomeDashboardData> => {
    try {
      const response = await api.get<ApiResponse<HomeDashboardData>>(
        API_ENDPOINTS.REPORTS.HOME_DASHBOARD
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch home dashboard data');
    }
  },

  // Get sales trend data (machine sales + paper roll orders per day)
  getSalesTrend: async (days: number = 30): Promise<SalesTrendData[]> => {
    try {
      const response = await api.get<ApiResponse<SalesTrendData[]>>(
        API_ENDPOINTS.REPORTS.SALES_TREND,
        { params: { days } }
      );
      return response.data.data;
    } catch (error: any) {
      return [];
    }
  },

  // Get live dashboard alerts
  getDashboardAlerts: async (): Promise<DashboardAlert[]> => {
    try {
      const response = await api.get<ApiResponse<DashboardAlert[]>>(
        API_ENDPOINTS.REPORTS.DASHBOARD_ALERTS
      );
      return response.data.data;
    } catch (error: any) {
      return [];
    }
  },

  // Get finance & revenue data with date filter
  getFinanceData: async (startDate?: string, endDate?: string): Promise<FinanceData> => {
    try {
      const response = await api.get<ApiResponse<FinanceData>>(
        API_ENDPOINTS.REPORTS.FINANCE,
        { params: { startDate, endDate } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch finance data');
    }
  },

  // Get sales team performance data
  getSalesTeamData: async (period?: string, belt?: string): Promise<SalesTeamData> => {
    try {
      const response = await api.get<ApiResponse<SalesTeamData>>(
        API_ENDPOINTS.REPORTS.SALES_TEAM,
        { params: { period, belt } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch sales team data');
    }
  },

  // Get executive detail by ID
  getExecutiveDetail: async (execId: string): Promise<ExecutiveDetail> => {
    try {
      const response = await api.get<ApiResponse<ExecutiveDetail>>(
        API_ENDPOINTS.REPORTS.EXECUTIVE_DETAIL(execId)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch executive detail');
    }
  },
};
