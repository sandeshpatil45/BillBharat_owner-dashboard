import api from './api';
import type { Customer, CustomerFilters, PaginatedResponse, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const customerService = {
  // Get current business (customer profile)
  getCurrentBusiness: async (): Promise<Customer> => {
    try {
      const response = await api.get<ApiResponse<Customer>>(
        API_ENDPOINTS.BUSINESS.CURRENT
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch business details');
    }
  },

  // Setup new business profile
  setupBusiness: async (businessData: any): Promise<Customer> => {
    try {
      const response = await api.post<ApiResponse<Customer>>(
        API_ENDPOINTS.BUSINESS.SETUP,
        businessData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to setup business profile');
    }
  },

  // Update business profile
  updateBusiness: async (businessData: any): Promise<Customer> => {
    try {
      const response = await api.put<ApiResponse<Customer>>(
        API_ENDPOINTS.BUSINESS.UPDATE,
        businessData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update business profile');
    }
  },

  // Get all customers with filters and pagination
  getCustomers: async (
    filters?: CustomerFilters,
    page: number = 1,
    pageSize: number = 25
  ): Promise<PaginatedResponse<Customer>> => {
    try {
      const params = {
        page,
        pageSize,
        ...filters,
      };
      
      const response = await api.get<ApiResponse<PaginatedResponse<Customer>>>(
        API_ENDPOINTS.CUSTOMERS.LIST,
        { params }
      );
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch customers');
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      const response = await api.get<ApiResponse<Customer>>(
        API_ENDPOINTS.CUSTOMERS.DETAIL(id)
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch customer details');
    }
  },

  // Export customers to CSV
  exportCustomers: async (filters?: CustomerFilters): Promise<Blob> => {
    try {
      const response = await api.get(API_ENDPOINTS.CUSTOMERS.EXPORT, {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export customers');
    }
  },

  // Get unique cities for filter
  getCities: async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<string[]>>('/customers/cities');
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },

  // Get unique talukas for filter
  getTalukas: async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<string[]>>('/customers/talukas');
      return response.data.data;
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist
      return [];
    }
  },
};
