import api from './api';
import type { ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const paymentService = {
  // Create Razorpay order for payment collection
  createOrder: async (orderData: {
    amount: number;
    currency?: string;
    receipt?: string;
    [key: string]: any;
  }): Promise<any> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        API_ENDPOINTS.PAYMENTS.CREATE_ORDER,
        orderData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment order');
    }
  },

  // Verify payment transaction (Razorpay)
  verifyPayment: async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    [key: string]: any;
  }): Promise<any> => {
    try {
      const response = await api.post<ApiResponse<any>>(
        API_ENDPOINTS.PAYMENTS.VERIFY,
        paymentData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify payment');
    }
  },
};
