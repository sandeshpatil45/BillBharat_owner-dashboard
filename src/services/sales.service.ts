import api from './api';
import type { SalesPerformance, SalesFilters, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const salesService = {
  // Get all bills (sales/invoices)
  getBills: async (filters?: SalesFilters): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.BILLS.LIST,
        { params: filters }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bills');
    }
  },

  // Get bill by ID
  getBillById: async (id: string): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.BILLS.DETAIL(id)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bill details');
    }
  },

  // Get bill by bill number
  getBillByNumber: async (billNumber: string): Promise<any> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.BILLS.BY_NUMBER(billNumber)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bill by number');
    }
  },

  // Get bills in date range
  getBillsByDateRange: async (startDate: string, endDate: string): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        API_ENDPOINTS.BILLS.DATE_RANGE,
        { params: { startDate, endDate } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bills by date range');
    }
  },

  // Get sales performance data (backward compatibility)
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
