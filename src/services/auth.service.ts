import api from './api';
import type { LoginCredentials, User, ApiResponse } from '../types';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from '../utils/constants';

export const authService = {
  // Send OTP for login
  sendOTP: async (phoneNumber: string): Promise<void> => {
    try {
      await api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.SEND_OTP, { phoneNumber });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Verify OTP code
  verifyOTP: async (phoneNumber: string, otp: string): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        phoneNumber,
        otp,
      });
      const user = response.data.data;
      
      // Store token and user in localStorage
      if (user.token) {
        localStorage.setItem(TOKEN_KEY, user.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  },

  // Resend OTP
  resendOTP: async (phoneNumber: string): Promise<void> => {
    try {
      await api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESEND_OTP, { phoneNumber });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  },

  // Register shop & owner
  register: async (registrationData: any): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, registrationData);
      const user = response.data.data;
      
      // Store token and user in localStorage
      if (user.token) {
        localStorage.setItem(TOKEN_KEY, user.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const user = response.data.data;
      
      // Store token and user in localStorage
      if (user.token) {
        localStorage.setItem(TOKEN_KEY, user.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Change Password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to change password');
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },
};
